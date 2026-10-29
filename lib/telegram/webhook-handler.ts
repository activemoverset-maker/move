import { prisma } from '@/lib/prisma'
import {
  addisChat,
  addisGenerateVoice,
  addisTranscribeVoice,
  detectTargetLanguage,
  type ChatMessage,
} from '@/lib/addis/client'
import {
  downloadTelegramFile,
  humanTelegramLink,
  humanTelegramUsername,
  sendChatAction,
  sendMessage,
} from '@/lib/telegram/bot'
import { sendMessageToUser, sendVoiceToUser } from '@/lib/telegram/delivery'
import { scheduleMediaAck } from '@/lib/telegram/media-ack'
import { maybePostStaffReport, notifyStaffFollowUp } from '@/lib/telegram/report'
import {
  markMessageCounted,
  readCapsUnderLock,
  releaseTurnLock,
  tryAcquireTurnLock,
} from '@/lib/telegram/locks'
import type { TelegramMessage, TelegramUpdate } from '@/lib/telegram/types'
import {
  cancelIntake,
  handleIntakeCallback,
  handleIntakeMedia,
  handleIntakeMessage,
  offerQuoteMenuIfKeyword,
  sendHelpOnly,
  sendPrivacyAndMenu,
  startQuoteFlow,
} from '@/lib/telegram/intake/handler'
import { detectIntakeLocale, parsePreferredLocale } from '@/lib/telegram/intake/locale'
import { getActiveSession, getOrCreateUserFrom, parsePhone } from '@/lib/telegram/user-session'
import { randomUUID } from 'crypto'

const COMMAND_RE = /^\/(start|help|cancel|quote)(@\w+)?(\s|$)/i
const HUMAN_KEYWORDS =
  /(ሰው|አድርገኝ|ቅሬታ|agent|human|call me|manager|speak to someone)/i

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function runChatActionLoop(
  chatId: string,
  action: 'typing' | 'record_voice' | 'upload_voice',
  until: () => boolean
) {
  while (!until()) {
    try {
      await sendChatAction(chatId, action)
    } catch {
      /* ignore */
    }
    await sleep(4000)
  }
}

function spokenScript(fullText: string): string {
  const sentences = fullText.split(/(?<=[.!?።])\s+/).filter(Boolean)
  return sentences.slice(0, 5).join(' ').slice(0, 600) || fullText.slice(0, 400)
}

function isCommand(text: string): boolean {
  return COMMAND_RE.test(text.trim())
}

async function getConversationHistory(sessionId: string): Promise<ChatMessage[]> {
  const rows = await prisma.telegramMessage.findMany({
    where: {
      sessionId,
      role: { in: ['user', 'assistant'] },
      text: { not: null },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return rows
    .reverse()
    .map((r) => ({ role: r.role as 'user' | 'assistant', content: r.text! }))
}

async function deliverAssistantReply(
  user: { id: string; chatId: string },
  sessionId: string,
  userText: string,
  options: {
    countedBefore: number
    userTelegramMessageId: string
    telegramUserId: string
  }
) {
  const history = await getConversationHistory(sessionId)
  const messages: ChatMessage[] = [...history, { role: 'user', content: userText }]
  const lang = detectTargetLanguage(userText)

  let done = false
  const actionTask = runChatActionLoop(user.chatId, 'typing', () => done)

  let chatResult
  try {
    chatResult = await addisChat(messages, lang)
  } finally {
    done = true
    await actionTask
  }

  if (!chatResult.text || chatResult.finishReason === 'safety') {
    await sendMessageToUser(
      user.id,
      user.chatId,
      `እባክዎ ቡድናችንን ያግኙ @${humanTelegramUsername()} — ${humanTelegramLink()}`
    )
    return
  }

  let replyText = chatResult.text
  const n = options.countedBefore
  if (n >= 17 && n <= 18) {
    replyText += `\n\n(${20 - n} replies left today, then our team.)`
  }
  if (n === 19) {
    replyText += `\n\nThis is your last automated reply today. Please message @${humanTelegramUsername()}.`
  }

  const voiceScript = spokenScript(replyText)
  let voiceOk = false
  let ttsSeconds: number | undefined

  done = false
  const uploadLoop = runChatActionLoop(user.chatId, 'upload_voice', () => done)
  try {
    const { audio, seconds } = await addisGenerateVoice(
      voiceScript,
      `tts-${randomUUID()}`,
      lang
    )
    ttsSeconds = seconds
    const caption = voiceScript.length <= 900 ? voiceScript : voiceScript.slice(0, 900)
    await sendVoiceToUser(user.id, user.chatId, audio, { caption })
    voiceOk = true
  } catch (e) {
    console.error('TTS failed:', e)
  } finally {
    done = true
    await uploadLoop
  }

  if (replyText.length > (voiceOk ? 900 : 0) || !voiceOk) {
    await sendMessageToUser(user.id, user.chatId, replyText)
  }

  if (!voiceOk && replyText.length === 0) return

  await prisma.telegramMessage.create({
    data: {
      userId: user.id,
      sessionId,
      telegramMessageId: `assistant-${randomUUID()}`,
      role: 'assistant',
      kind: voiceOk ? 'voice' : 'text',
      text: replyText,
      promptTokens: chatResult.promptTokens,
      completionTokens: chatResult.completionTokens,
      ttsSeconds,
    },
  })

  await markMessageCounted(
    options.telegramUserId,
    user.id,
    options.userTelegramMessageId
  )

  if (n === 19) {
    await maybePostStaffReport(sessionId, 'limit_reached')
  }
}

function isCancelCommand(text: string): boolean {
  return /^\/cancel(@\w+)?(\s|$)/i.test(text.trim())
}

function isHelpCommand(text: string): boolean {
  return /^\/help(@\w+)?(\s|$)/i.test(text.trim())
}

function isQuoteCommand(text: string): boolean {
  return /^\/quote(@\w+)?(\s|$)/i.test(text.trim())
}

async function handleTextTurn(
  user: Awaited<ReturnType<typeof getOrCreateUserFrom>>,
  session: Awaited<ReturnType<typeof getActiveSession>>,
  message: TelegramMessage
) {
  const text = (message.text || '').trim()
  if (!text) return

  if (isCommand(text)) {
    if (user.awaitingName && user.firstName && user.firstName.length >= 2) {
      await prisma.telegramUser.update({
        where: { id: user.id },
        data: { displayName: user.firstName, awaitingName: false },
      })
    }
    if (isCancelCommand(text)) {
      await cancelIntake(user, session.id)
    } else if (isHelpCommand(text)) {
      await sendHelpOnly({ ...user, displayName: user.displayName || user.firstName })
    } else if (isQuoteCommand(text)) {
      const u = await prisma.telegramUser.findUnique({ where: { id: user.id } })
      const locale = parsePreferredLocale(u?.preferredLocale)
      await startQuoteFlow(
        { ...user, displayName: user.displayName || user.firstName },
        session.id,
        locale
      )
    } else {
      await sendPrivacyAndMenu({ ...user, displayName: user.displayName || user.firstName })
    }
    await prisma.telegramMessage.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        telegramMessageId: String(message.message_id),
        role: 'user',
        kind: 'command',
        text,
      },
    })
    return
  }

  if (user.awaitingName) {
    await prisma.telegramUser.update({
      where: { id: user.id },
      data: { displayName: text.slice(0, 80), awaitingName: false },
    })
    await sendMessageToUser(user.id, user.chatId, `Thank you, ${text}!`)
    await sendPrivacyAndMenu(user)
    return
  }

  const intakeSession = await prisma.telegramSession.findUnique({ where: { id: session.id } })
  if (intakeSession?.intakeStep) {
    await handleIntakeMessage(user, session.id, message)
    return
  }

  if (user.awaitingPhone) {
    const phone = parsePhone(text)
    if (phone) {
      await prisma.telegramSession.update({
        where: { id: session.id },
        data: { phone },
      })
      await prisma.telegramUser.update({
        where: { id: user.id },
        data: { awaitingPhone: false },
      })
      await sendMessageToUser(user.id, user.chatId, 'Thank you — our team will follow up with a quote.')
      await maybePostStaffReport(session.id, 'needs_quote')
    } else {
      await sendMessageToUser(user.id, user.chatId, 'Please share your phone (+2519… or 09…).')
    }
    return
  }

  if (await offerQuoteMenuIfKeyword(user, text)) {
    return
  }

  if (HUMAN_KEYWORDS.test(text)) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      `Connecting you with our team — message @${humanTelegramUsername()} ${humanTelegramLink()}`
    )
    const fresh = await prisma.telegramSession.findUnique({ where: { id: session.id } })
    if (fresh?.handoffAt) {
      await notifyStaffFollowUp(session.id, 'human_again')
    } else {
      await maybePostStaffReport(session.id, 'asked_for_human')
    }
    return
  }

  const caps = await readCapsUnderLock(user.telegramUserId, user.id)
  if (caps.counted24h >= 20) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      `Daily limit reached. Please contact @${humanTelegramUsername()} — ${humanTelegramLink()}`
    )
    if (!session.handoffAt) {
      await maybePostStaffReport(session.id, 'limit_reached')
    }
    return
  }

  if (caps.counted10m >= 8) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      'እባክዎ ትንሽ ይጠብቁ — too many messages. Try again in a few minutes.'
    )
    return
  }

  const detectedLocale = detectIntakeLocale(text)
  await prisma.telegramUser.update({
    where: { id: user.id },
    data: { preferredLocale: detectedLocale },
  })

  const msgId = String(message.message_id)
  await prisma.telegramMessage.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      telegramMessageId: msgId,
      role: 'user',
      kind: 'text',
      text,
    },
  })

  await deliverAssistantReply(user, session.id, text, {
    countedBefore: caps.counted24h,
    userTelegramMessageId: msgId,
    telegramUserId: user.telegramUserId,
  })
}

async function handleVoiceTurn(
  user: Awaited<ReturnType<typeof getOrCreateUserFrom>>,
  session: Awaited<ReturnType<typeof getActiveSession>>,
  message: TelegramMessage
) {
  const voice = message.voice
  if (!voice) return

  const freshSession = await prisma.telegramSession.findUnique({ where: { id: session.id } })
  if (freshSession?.intakeStep) {
    await handleIntakeMessage(user, session.id, message)
    return
  }
  if (voice.duration && voice.duration > 180) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      'Voice note too long (max 3 minutes). Please type or send a shorter note.'
    )
    return
  }

  const capsPre = await readCapsUnderLock(user.telegramUserId, user.id)
  if (capsPre.counted24h >= 20) {
    await sendMessageToUser(user.id, user.chatId, `Daily limit reached. @${humanTelegramUsername()}`)
    return
  }
  if (capsPre.counted10m >= 8) {
    await sendMessageToUser(user.id, user.chatId, 'Please wait a few minutes before sending more.')
    return
  }

  let done = false
  const recLoop = runChatActionLoop(user.chatId, 'record_voice', () => done)
  let transcript: string
  let sttChars: number | undefined
  try {
    const buf = await downloadTelegramFile(voice.file_id)
    const stt = await addisTranscribeVoice(buf, `scribe-${randomUUID()}`)
    transcript = stt.text
    sttChars = stt.characters
  } catch (e) {
    console.error('Scribe failed:', e)
    await sendMessageToUser(user.id, user.chatId, 'Could not hear that — please type your question.')
    return
  } finally {
    done = true
    await recLoop
  }

  if (!transcript) {
    await sendMessageToUser(user.id, user.chatId, 'Empty transcript — please try again or type.')
    return
  }

  const msgId = String(message.message_id)
  await prisma.telegramMessage.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      telegramMessageId: msgId,
      role: 'user',
      kind: 'voice',
      text: transcript,
      fileId: voice.file_id,
      sttCharacters: sttChars,
    },
  })

  const caps = await readCapsUnderLock(user.telegramUserId, user.id)
  if (caps.counted24h >= 20) return

  await deliverAssistantReply(user, session.id, transcript, {
    countedBefore: caps.counted24h,
    userTelegramMessageId: msgId,
    telegramUserId: user.telegramUserId,
  })
}

async function handleMedia(
  user: Awaited<ReturnType<typeof getOrCreateUserFrom>>,
  session: Awaited<ReturnType<typeof getActiveSession>>,
  message: TelegramMessage
) {
  const photo = message.photo?.[message.photo.length - 1]
  const video = message.video
  const fileId = photo?.file_id || video?.file_id
  if (!fileId) return

  const mediaCount = await prisma.telegramMessage.count({
    where: {
      userId: user.id,
      kind: { in: ['photo', 'video'] },
      createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })
  if (mediaCount >= 15) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      'Photo limit for today — our team already has your files.'
    )
    return
  }

  await prisma.telegramMessage.create({
    data: {
      userId: user.id,
      sessionId: session.id,
      telegramMessageId: String(message.message_id),
      mediaGroupId: message.media_group_id,
      role: 'user',
      kind: photo ? 'photo' : 'video',
      fileId,
    },
  })

  await prisma.telegramSession.update({
    where: { id: session.id },
    data: { lastMediaAt: new Date(), mediaAckSent: false },
  })

  const updated = await prisma.telegramSession.findUnique({ where: { id: session.id } })
  if (!updated?.phone) {
    await prisma.telegramUser.update({
      where: { id: user.id },
      data: { awaitingPhone: true },
    })
    await sendMessageToUser(
      user.id,
      user.chatId,
      'Thanks — photos received. Please share your phone number (+251…) for a quote.'
    )
    return
  }

  if (updated.handoffAt) {
    await notifyStaffFollowUp(session.id, 'more_media')
  } else {
    await maybePostStaffReport(session.id, 'needs_quote')
  }
}

async function handleCallbackTurn(update: TelegramUpdate): Promise<void> {
  const query = update.callback_query
  if (!query?.from || query.from.is_bot) return
  const chat = query.message?.chat
  if (!chat || chat.type !== 'private') return

  const chatId = String(chat.id)
  const user = await getOrCreateUserFrom(query.from, chatId)
  if (user.isBlocked) return

  const session = await getActiveSession(user.id)

  const acquired = await tryAcquireTurnLock(user.id)
  if (!acquired) {
    await sendMessageToUser(user.id, user.chatId, 'እባክዎ ትንሽ ይጠብቁ… One moment please.')
    return
  }

  try {
    await handleIntakeCallback(user, session.id, query)
  } finally {
    await releaseTurnLock(user.id)
  }
}

async function handleMessageTurn(update: TelegramUpdate): Promise<void> {
  const message = update.message
  if (!message?.from || message.from.is_bot) return
  if (message.chat.type !== 'private') return

  const user = await getOrCreateUserFrom(message.from, String(message.chat.id))
  if (user.isBlocked) return

  const session = await getActiveSession(user.id)
  const sessionRow = await prisma.telegramSession.findUnique({ where: { id: session.id } })

  if (message.contact?.phone_number) {
    const phone = parsePhone(message.contact.phone_number)
    if (phone) {
      if (sessionRow?.intakeStep === 'phone') {
        await handleIntakeMessage(user, session.id, message)
      } else {
        await prisma.telegramSession.update({ where: { id: session.id }, data: { phone } })
        await prisma.telegramUser.update({ where: { id: user.id }, data: { awaitingPhone: false } })
        await maybePostStaffReport(session.id, 'needs_quote')
      }
    }
    return
  }

  const acquired = await tryAcquireTurnLock(user.id)
  if (!acquired) {
    await sendMessageToUser(user.id, user.chatId, 'እባክዎ ትንሽ ይጠብቁ… One moment please.')
    return
  }

  try {
    if (message.photo || message.video) {
      if (sessionRow?.intakeStep) {
        await handleIntakeMedia(user, session.id, message)
      } else {
        await handleMedia(user, session, message)
        await scheduleMediaAck(session.id, user.id, user.chatId)
      }
    } else if (message.voice) {
      await handleVoiceTurn(user, session, message)
    } else if (message.text) {
      await handleTextTurn(user, session, message)
    }
  } catch (e) {
    console.error('handleTurn error:', e)
    try {
      await sendMessageToUser(
        user.id,
        user.chatId,
        'Sorry — something went wrong. Please try again or @' + humanTelegramUsername()
      )
    } catch {
      /* user may have blocked bot */
    }
  } finally {
    await releaseTurnLock(user.id)
  }
}

export async function handleTurn(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallbackTurn(update)
    return
  }
  if (update.message) {
    await handleMessageTurn(update)
  }
}

export async function safeApology(chatId: string) {
  try {
    await sendMessage(chatId, 'Sorry — please try again in a moment.')
  } catch {
    /* ignore */
  }
}
