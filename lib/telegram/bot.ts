const API_BASE = 'https://api.telegram.org'

export class TelegramApiError extends Error {
  errorCode?: number

  constructor(message: string, errorCode?: number) {
    super(message)
    this.name = 'TelegramApiError'
    this.errorCode = errorCode
  }
}

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  return token
}

export async function telegramApi<T>(
  method: string,
  body?: Record<string, unknown> | FormData
): Promise<T> {
  const url = `${API_BASE}/bot${botToken()}/${method}`
  const isForm = body instanceof FormData
  const response = await fetch(url, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })
  const data = (await response.json()) as {
    ok: boolean
    description?: string
    error_code?: number
    result?: T
  }
  if (!data.ok) {
    throw new TelegramApiError(
      data.description || `Telegram ${method} failed`,
      data.error_code
    )
  }
  return data.result as T
}

export async function sendMessage(chatId: string, text: string): Promise<{ message_id: number }> {
  return telegramApi('sendMessage', { chat_id: chatId, text })
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  options?: { text?: string; show_alert?: boolean }
): Promise<void> {
  await telegramApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: options?.text,
    show_alert: options?.show_alert,
  })
}

type InlineButton = { text: string; callback_data: string }

export async function sendMessageWithInlineKeyboard(
  chatId: string,
  text: string,
  keyboard: InlineButton[][] 
): Promise<{ message_id: number }> {
  return telegramApi('sendMessage', {
    chat_id: chatId,
    text: text.trim() || ' ',
    reply_markup: { inline_keyboard: keyboard },
  })
}

export async function sendMessageWithReplyKeyboard(
  chatId: string,
  text: string,
  replyMarkup: Record<string, unknown>
): Promise<{ message_id: number }> {
  return telegramApi('sendMessage', {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
  })
}

export async function removeReplyKeyboard(chatId: string): Promise<void> {
  await telegramApi('sendMessage', {
    chat_id: chatId,
    text: ' ',
    reply_markup: { remove_keyboard: true },
  })
}

export async function sendChatAction(
  chatId: string,
  action: 'typing' | 'record_voice' | 'upload_voice'
): Promise<void> {
  await telegramApi('sendChatAction', { chat_id: chatId, action })
}

export async function sendVoiceMultipart(
  chatId: string,
  audio: Buffer,
  options?: { caption?: string }
): Promise<{ message_id: number }> {
  const form = new FormData()
  form.append('chat_id', chatId)
  const blob = new Blob([audio], { type: 'audio/mpeg' })
  form.append('voice', blob, 'reply.mp3')
  if (options?.caption) {
    form.append('caption', options.caption.slice(0, 1024))
  }
  return telegramApi('sendVoice', form)
}

export async function downloadTelegramFile(fileId: string): Promise<Buffer> {
  const file = await telegramApi<{ file_path: string }>('getFile', { file_id: fileId })
  const fileUrl = `${API_BASE}/file/bot${botToken()}/${file.file_path}`
  const res = await fetch(fileUrl)
  if (!res.ok) throw new Error('Failed to download Telegram file')
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export function humanTelegramUsername(): string {
  return (process.env.TELEGRAM_USERNAME || 'activemovers').replace(/^@/, '')
}

export function humanTelegramLink(): string {
  return `https://t.me/${humanTelegramUsername()}`
}
