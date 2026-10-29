export type TelegramUser = {
  id: number
  is_bot?: boolean
  first_name?: string
  last_name?: string
  username?: string
}

export type TelegramChat = {
  id: number
  type: string
}

export type TelegramMessage = {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  voice?: { file_id: string; duration?: number }
  photo?: { file_id: string }[]
  video?: { file_id: string }
  contact?: { phone_number: string; user_id?: number }
  media_group_id?: string
}

export type CallbackQuery = {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

export type TelegramUpdate = {
  update_id: number
  message?: TelegramMessage
  callback_query?: CallbackQuery
}
