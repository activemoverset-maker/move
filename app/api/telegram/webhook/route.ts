import { timingSafeEqual } from 'crypto'
import { after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleTurn, safeApology } from '@/lib/telegram/webhook-handler'
import type { TelegramUpdate } from '@/lib/telegram/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

function verifyWebhookSecret(header: string | null): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret) {
    return process.env.NODE_ENV !== 'production'
  }
  if (!header) return false
  const a = Buffer.from(header)
  const b = Buffer.from(secret)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
  if (!verifyWebhookSecret(secretHeader)) {
    if (process.env.TELEGRAM_WEBHOOK_SECRET || process.env.NODE_ENV === 'production') {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  let update: TelegramUpdate
  try {
    update = (await request.json()) as TelegramUpdate
  } catch (e) {
    console.error('Webhook JSON parse error:', e)
    return Response.json({ ok: true })
  }

  const updateId = String(update.update_id)

  try {
    await prisma.telegramUpdate.create({ data: { updateId } })
  } catch {
    return Response.json({ ok: true })
  }

  const message = update.message
  const callbackQuery = update.callback_query
  const chatId =
    message?.chat?.type === 'private' && message.chat.id
      ? String(message.chat.id)
      : callbackQuery?.message?.chat?.type === 'private' && callbackQuery.message.chat.id
        ? String(callbackQuery.message.chat.id)
        : null

  after(async () => {
    try {
      await handleTurn(update)
    } catch (e) {
      console.error('Webhook after() error:', e)
      if (chatId) await safeApology(chatId)
    }
  })

  return Response.json({ ok: true })
}
