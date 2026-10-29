import { prisma } from '@/lib/prisma'
import {
  answerCallbackQuery,
  removeReplyKeyboard,
  sendMessageWithInlineKeyboard,
  sendMessageWithReplyKeyboard,
} from '@/lib/telegram/bot'
import { sendMessageToUser, sendVoiceToUser } from '@/lib/telegram/delivery'
import { humanTelegramLink, humanTelegramUsername } from '@/lib/telegram/bot'
import { maybePostStaffReport, notifyStaffFollowUp } from '@/lib/telegram/report'
import { helpText, menuPrompt, promptForStep } from '@/lib/telegram/intake/copy'
import { formatReviewSummary } from '@/lib/telegram/intake/format'
import { looksLikeFaqQuestion } from '@/lib/telegram/intake/faq-heuristic'
import {
  intakeFaqChoiceKeyboard,
  keyboardForStep,
  mainMenuKeyboard,
  phoneReplyKeyboard,
} from '@/lib/telegram/intake/keyboards'
import { nextStepAfter, stepExpectsText } from '@/lib/telegram/intake/steps'
import {
  emptyIntakeData,
  parseIntakeData,
  type DwellingType,
  type IntakeData,
  type IntakeLocale,
  type IntakeStep,
} from '@/lib/telegram/intake/types'
import { isQuoteIntent } from '@/lib/telegram/intake/keywords'
import { detectIntakeLocale, parsePreferredLocale } from '@/lib/telegram/intake/locale'
import { intakeMeetsReportMinimum, parsePhone } from '@/lib/telegram/intake/validate'
import { addisGenerateVoice } from '@/lib/addis/client'
import type { CallbackQuery, TelegramMessage } from '@/lib/telegram/types'

type UserRow = {
  id: string
  chatId: string
  telegramUserId: string
  awaitingName: boolean
  displayName?: string | null
  firstName?: string | null
}

type SessionRow = {
  id: string
  intakeStep: string | null
  intakeData: unknown
  phone: string | null
  handoffAt: Date | null
}

const HUMAN_KEYWORDS =
  /(ሰው|አድርገኝ|ቅሬታ|agent|human|call me|manager|speak to someone)/i

async function getUserLocale(userId: string): Promise<IntakeLocale> {
  const u = await prisma.telegramUser.findUnique({ where: { id: userId } })
  return parsePreferredLocale(u?.preferredLocale)
}

export async function sendPrivacyAndMenu(user: UserRow): Promise<void> {
  const locale = await getUserLocale(user.id)
  const privacy =
    locale === 'en'
      ? 'Active Movers: messages may be reviewed by staff for quotes. Continue only if you agree.'
      : 'Active Movers፡ መልዕክቶች ለዋጋ ሊታዩ ይችላሉ። በመቀጠል እንደ ተስማምተው ይቆጠራል።'
  const name = user.displayName || user.firstName
  const greet =
    locale === 'en'
      ? `Welcome${name ? ` ${name}` : ''}!`
      : `እንኳን ደህና መጡ${name ? ` ${name}` : ''}!`
  await sendMessageToUser(user.id, user.chatId, `${privacy}\n\n${greet}\n\n${menuPrompt(locale)}`)
  await sendMessageWithInlineKeyboard(user.chatId, ' ', mainMenuKeyboard())

  const dbUser = await prisma.telegramUser.findUnique({ where: { id: user.id } })
  if (dbUser && !dbUser.welcomeVoiceSent) {
    try {
      const script =
        locale === 'en'
          ? 'Welcome to Active Movers! Tap Get a quote or ask a question.'
          : 'እንኳን ደህና መጡ! ዋጋ ለመጠየቅ Get a quote ይጫኑ።'
      const { audio } = await addisGenerateVoice(script, `welcome-${user.id}`, 'am')
      await sendVoiceToUser(user.id, user.chatId, audio, { caption: 'Active Movers' })
      await prisma.telegramUser.update({
        where: { id: user.id },
        data: { welcomeVoiceSent: true },
      })
    } catch (e) {
      console.error('Welcome TTS failed:', e)
    }
  }
}

export async function offerQuoteMenuIfKeyword(user: UserRow, text: string): Promise<boolean> {
  if (!isQuoteIntent(text)) return false
  const locale = await getUserLocale(user.id)
  const msg =
    locale === 'en'
      ? 'For a moving quote, tap Get a quote below. Or ask a general question with Ask a question.'
      : 'ለዋጋ “Get a quote” ይጫኑ። ለጥቅስ ጥያቄ “Ask a question” ይጠቀሙ።'
  await sendMessageToUser(user.id, user.chatId, msg)
  await sendMessageWithInlineKeyboard(user.chatId, menuPrompt(locale), mainMenuKeyboard())
  return true
}

async function loadSession(sessionId: string): Promise<SessionRow> {
  const s = await prisma.telegramSession.findUniqueOrThrow({ where: { id: sessionId } })
  return {
    id: s.id,
    intakeStep: s.intakeStep,
    intakeData: s.intakeData,
    phone: s.phone,
    handoffAt: s.handoffAt,
  }
}

async function saveIntake(
  sessionId: string,
  step: IntakeStep | null,
  data: IntakeData,
  extra?: { phone?: string }
) {
  await prisma.telegramSession.update({
    where: { id: sessionId },
    data: {
      intakeStep: step,
      intakeData: data,
      ...(extra?.phone ? { phone: extra.phone } : {}),
    },
  })
}

async function promptStep(
  user: UserRow,
  step: IntakeStep,
  data: IntakeData
): Promise<void> {
  const locale = data.locale ?? 'am'
  const text = promptForStep(step, locale)
  if (step === 'phone') {
    await sendMessageWithReplyKeyboard(user.chatId, text, phoneReplyKeyboard())
    return
  }
  await removeReplyKeyboard(user.chatId)
  const kb = keyboardForStep(step, data)
  if (kb.length) {
    await sendMessageWithInlineKeyboard(user.chatId, text, kb)
  } else {
    await sendMessageToUser(user.id, user.chatId, text)
  }
}

async function advance(
  user: UserRow,
  sessionId: string,
  data: IntakeData,
  fromStep: IntakeStep
): Promise<void> {
  const next = nextStepAfter(fromStep, data)
  if (!next) {
    await saveIntake(sessionId, null, data)
    return
  }
  await saveIntake(sessionId, next, data)
  await promptStep(user, next, data)
}

export async function startQuoteFlow(user: UserRow, sessionId: string, locale: IntakeLocale) {
  if (user.awaitingName) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      locale === 'en'
        ? 'What is your first name?'
        : 'ስምዎን ይንገሩን (አንድ ቃል)።'
    )
    return
  }
  const data = emptyIntakeData(locale)
  await prisma.telegramSession.update({
    where: { id: sessionId },
    data: {
      intakeStep: 'move_date',
      intakeData: data,
      intakeStartedAt: new Date(),
    },
  })
  await prisma.telegramUser.update({
    where: { id: user.id },
    data: { awaitingPhone: false },
  })
  await promptStep(user, 'move_date', data)
}

export async function sendHelpOnly(user: UserRow): Promise<void> {
  const locale = await getUserLocale(user.id)
  await sendMessageToUser(user.id, user.chatId, helpText(locale))
  await sendMessageWithInlineKeyboard(user.chatId, menuPrompt(locale), mainMenuKeyboard())
}

export async function cancelIntake(user: UserRow, sessionId: string) {
  const locale = await getUserLocale(user.id)
  await saveIntake(sessionId, null, emptyIntakeData(locale))
  await removeReplyKeyboard(user.chatId)
  await sendMessageToUser(
    user.id,
    user.chatId,
    locale === 'en'
      ? 'Quote cancelled. Tap Get a quote to start again.'
      : 'ዋጋ ተሰርዘዋል። እንደገና Get a quote ይጫኑ።'
  )
  await sendMessageWithInlineKeyboard(user.chatId, menuPrompt(locale), mainMenuKeyboard())
}

async function mirrorIntakeToScalars(sessionId: string, data: IntakeData, phone: string | null) {
  const notes: string[] = []
  if (data.inventory?.length) notes.push(`Inventory: ${data.inventory.join(', ')}`)
  if (data.hasElevator !== undefined) {
    notes.push(`Elevator: ${String(data.hasElevator)}`)
  }
  if (data.floor) notes.push(`Floor: ${data.floor}`)
  if (data.officeDetails) notes.push(`Office: ${data.officeDetails}`)

  await prisma.telegramSession.update({
    where: { id: sessionId },
    data: {
      moveDate: data.moveDate ?? undefined,
      fromAddress: data.fromLocation ?? undefined,
      toAddress: data.toLocation ?? undefined,
      serviceType: data.dwellingType ?? 'local_move',
      phone: phone ?? undefined,
      notes: notes.length ? notes.join('\n') : undefined,
    },
  })
}

async function submitIntake(user: UserRow, sessionId: string) {
  const session = await loadSession(sessionId)
  if (session.intakeStep !== 'review') {
    return
  }
  const data = parseIntakeData(session.intakeData)
  const phone = session.phone
  const mediaCount = await prisma.telegramMessage.count({
    where: { sessionId, kind: { in: ['photo', 'video'] } },
  })

  if (!phone) {
    await saveIntake(sessionId, 'phone', data)
    await promptStep(user, 'phone', data)
    return
  }

  if (!intakeMeetsReportMinimum(data, phone, mediaCount)) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      'Please add move details, inventory, or at least one photo before submitting.'
    )
    return
  }

  await mirrorIntakeToScalars(sessionId, data, phone)

  if (session.handoffAt) {
    await notifyStaffFollowUp(sessionId, 'more_media')
  } else {
    await maybePostStaffReport(sessionId, 'intake_complete')
  }

  await saveIntake(sessionId, null, data)
  await removeReplyKeyboard(user.chatId)
  await sendMessageToUser(
    user.id,
    user.chatId,
    `Thank you! Our team will contact you. You can also message @${humanTelegramUsername()} ${humanTelegramLink()}`
  )
  await sendMessageWithInlineKeyboard(user.chatId, menuPrompt(data.locale ?? 'am'), mainMenuKeyboard())
}

export async function handleIntakeCallback(
  user: UserRow,
  sessionId: string,
  query: CallbackQuery
): Promise<void> {
  const dataRaw = query.data
  if (!dataRaw?.startsWith('intake:')) {
    await answerCallbackQuery(query.id, { text: 'Unknown action' })
    return
  }

  const session = await loadSession(sessionId)
  let intake = parseIntakeData(session.intakeData)

  const parts = dataRaw.split(':')
  const action = parts[1]

  if (action === 'menu') {
    const sub = parts[2]
    const menuLocale = await getUserLocale(user.id)
    await answerCallbackQuery(query.id)
    if (sub === 'lang') {
      const lang: IntakeLocale = parts[3] === 'en' ? 'en' : 'am'
      await prisma.telegramUser.update({
        where: { id: user.id },
        data: { preferredLocale: lang },
      })
      intake.locale = lang
      await saveIntake(sessionId, session.intakeStep as IntakeStep | null, intake)
      await sendMessageWithInlineKeyboard(user.chatId, menuPrompt(lang), mainMenuKeyboard())
      return
    }
    if (sub === 'quote') {
      await startQuoteFlow(user, sessionId, menuLocale)
    } else if (sub === 'faq') {
      await saveIntake(sessionId, null, intake)
      await sendMessageToUser(
        user.id,
        user.chatId,
        menuLocale === 'en'
          ? 'Ask your question in text or voice.'
          : 'ጥያቄዎን በጽሑፍ ወይም በድምፅ ማስታወሻ ይላኩ።'
      )
    } else if (sub === 'help') {
      await sendMessageToUser(user.id, user.chatId, helpText(menuLocale))
    }
    return
  }

  if (action === 'flow') {
    const sub = parts[2]
    const step = session.intakeStep as IntakeStep | null
    if (!step) {
      await answerCallbackQuery(query.id, { text: 'No active quote', show_alert: true })
      return
    }
    await answerCallbackQuery(query.id)
    const loc = intake.locale ?? 'am'
    if (sub === 'continue') {
      await promptStep(user, step, intake)
      return
    }
    if (sub === 'faq') {
      await saveIntake(sessionId, null, intake)
      await sendMessageToUser(
        user.id,
        user.chatId,
        loc === 'en'
          ? 'Quote paused. Ask your question in text or voice. Use /quote to continue later.'
          : 'ዋጋ ቆሟል። ጥያቄዎን በጽሑፍ ወይም በድምፅ ይላኩ። /quote ለመቀጠል።'
      )
      return
    }
    return
  }

  const step = session.intakeStep as IntakeStep | null
  if (!step && action !== 'menu') {
    await answerCallbackQuery(query.id, {
      text: 'Please /start again',
      show_alert: true,
    })
    return
  }

  if (action === 'date' && step === 'move_date' && parts[2] === 'unsure') {
    intake.moveDate = 'not sure'
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'move_date')
    return
  }

  if (action === 'dw' && step === 'dwelling_type') {
    const map: Record<string, DwellingType> = {
      condo: 'condo',
      apartment: 'apartment',
      house: 'house',
      office: 'office',
    }
    const dw = map[parts[2]]
    if (!dw) {
      await answerCallbackQuery(query.id)
      return
    }
    intake.dwellingType = dw
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'dwelling_type')
    return
  }

  if (action === 'fl' && step === 'floor') {
    const flMap: Record<string, string> = {
      g: '0',
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6p': '6+',
    }
    intake.floor = flMap[parts[2]] ?? parts[2]
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'floor')
    return
  }

  if (action === 'el' && step === 'elevator') {
    const el = parts[2]
    intake.hasElevator = el === 'y' ? true : el === 'n' ? false : 'unknown'
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'elevator')
    return
  }

  if (action === 'inv' && step === 'inventory') {
    const id = parts[2]
    const list = new Set(intake.inventory ?? [])
    const had = list.has(id)
    if (had) list.delete(id)
    else list.add(id)
    intake.inventory = Array.from(list)
    await saveIntake(sessionId, 'inventory', intake)
    await answerCallbackQuery(query.id, { text: had ? 'Removed' : 'Added' })
    await promptStep(user, 'inventory', intake)
    return
  }

  if (action === 'inv_done' && step === 'inventory') {
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'inventory')
    return
  }

  if (action === 'skip_photos' && step === 'inventory_photos') {
    await answerCallbackQuery(query.id)
    await advance(user, sessionId, intake, 'inventory_photos')
    return
  }

  if (action === 'submit' && step === 'review') {
    await answerCallbackQuery(query.id)
    await submitIntake(user, sessionId)
    return
  }

  if (action === 'edit' && parts[2] === 'restart' && step === 'review') {
    await answerCallbackQuery(query.id)
    await saveIntake(sessionId, 'move_date', intake)
    await promptStep(user, 'move_date', intake)
    return
  }

  await answerCallbackQuery(query.id, { text: 'Please use the latest message', show_alert: true })
}

export async function handleIntakeMessage(
  user: UserRow,
  sessionId: string,
  message: TelegramMessage
): Promise<boolean> {
  const session = await loadSession(sessionId)
  const step = session.intakeStep as IntakeStep | null
  if (!step) return false

  let intake = parseIntakeData(session.intakeData)
  const locale = intake.locale ?? 'am'

  if (message.voice) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      locale === 'en'
        ? 'Please type or use the buttons for this step.'
        : 'እባክዎ ለዚህ ደረጃ ይፃፉ ወይም ቁልፎችን ይጠቀሙ።'
    )
    return true
  }

  const text = (message.text || '').trim()

  if (text && HUMAN_KEYWORDS.test(text)) {
    await sendMessageToUser(
      user.id,
      user.chatId,
      `Connecting you with our team — @${humanTelegramUsername()}`
    )
    if (session.handoffAt) {
      await notifyStaffFollowUp(sessionId, 'human_again')
    } else {
      await maybePostStaffReport(sessionId, 'asked_for_human')
    }
    return true
  }

  if (step === 'phone') {
    if (message.contact?.phone_number) {
      const phone = parsePhone(message.contact.phone_number)
      if (phone) {
        await saveIntake(sessionId, 'review', intake, { phone })
        await removeReplyKeyboard(user.chatId)
        const reviewText = formatReviewSummary(intake, phone)
        await sendMessageWithInlineKeyboard(
          user.chatId,
          `${promptForStep('review', locale)}\n\n${reviewText}`,
          keyboardForStep('review', intake)
        )
        return true
      }
    }
    if (text) {
      const phone = parsePhone(text)
      if (phone) {
        await saveIntake(sessionId, 'review', intake, { phone })
        await removeReplyKeyboard(user.chatId)
        const reviewText = formatReviewSummary(intake, phone)
        await sendMessageWithInlineKeyboard(
          user.chatId,
          `${promptForStep('review', locale)}\n\n${reviewText}`,
          keyboardForStep('review', intake)
        )
        return true
      }
      await sendMessageToUser(user.id, user.chatId, 'Invalid phone. Use +2519… or 09…')
      return true
    }
    return true
  }

  if (!text || !stepExpectsText(step)) {
    return true
  }

  if (looksLikeFaqQuestion(text)) {
    const msg =
      locale === 'en'
        ? 'It looks like a general question. Continue the quote or switch to AI Q&A?'
        : 'ጥያቄ ይመስላል። ዋጋ ይቀጥሉ ወይስ ወደ ጥያቄ ይቀይሩ?'
    await sendMessageWithInlineKeyboard(user.chatId, msg, intakeFaqChoiceKeyboard(locale))
    return true
  }

  if (step === 'move_date') {
    intake.moveDate = text
    intake.locale = detectIntakeLocale(text)
    await prisma.telegramUser.update({
      where: { id: user.id },
      data: { preferredLocale: intake.locale },
    })
    await advance(user, sessionId, intake, 'move_date')
    return true
  }
  if (step === 'from_location') {
    intake.fromLocation = text.slice(0, 500)
    await advance(user, sessionId, intake, 'from_location')
    return true
  }
  if (step === 'to_location') {
    intake.toLocation = text.slice(0, 500)
    await advance(user, sessionId, intake, 'to_location')
    return true
  }
  if (step === 'office_details') {
    intake.officeDetails = text.slice(0, 1000)
    await advance(user, sessionId, intake, 'office_details')
    return true
  }
  if (step === 'floor') {
    intake.floor = text.slice(0, 20)
    await advance(user, sessionId, intake, 'floor')
    return true
  }

  return true
}

export async function handleIntakeMedia(
  user: UserRow,
  sessionId: string,
  message: TelegramMessage
): Promise<boolean> {
  const session = await loadSession(sessionId)
  if (!session.intakeStep) return false

  const photo = message.photo?.[message.photo.length - 1]
  const video = message.video
  const fileId = photo?.file_id || video?.file_id
  if (!fileId) return false

  const mediaCount = await prisma.telegramMessage.count({
    where: {
      userId: user.id,
      kind: { in: ['photo', 'video'] },
      createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })
  if (mediaCount >= 15) {
    await sendMessageToUser(user.id, user.chatId, 'Photo limit for today.')
    return true
  }

  await prisma.telegramMessage.create({
    data: {
      userId: user.id,
      sessionId,
      telegramMessageId: String(message.message_id),
      mediaGroupId: message.media_group_id,
      role: 'user',
      kind: photo ? 'photo' : 'video',
      fileId,
    },
  })

  const intake = parseIntakeData(session.intakeData)
  intake.hasMedia = true
  await saveIntake(sessionId, session.intakeStep as IntakeStep, intake)

  const locale = intake.locale ?? 'am'
  await sendMessageToUser(
    user.id,
    user.chatId,
    locale === 'en' ? 'Photo received.' : 'ስዕል ተቀብለናል።'
  )
  return true
}
