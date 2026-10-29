import { prisma } from '@/lib/prisma'
import { humanTelegramUsername } from '@/lib/telegram/bot'
import { sendMessageToUser } from '@/lib/telegram/delivery'

const ALBUM_QUIET_MS = 3000

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** One thank-you per album burst (serverless-safe). */
export async function scheduleMediaAck(
  sessionId: string,
  userId: string,
  chatId: string
): Promise<void> {
  await sleep(ALBUM_QUIET_MS)

  const updated = await prisma.telegramSession.updateMany({
    where: {
      id: sessionId,
      mediaAckSent: false,
      lastMediaAt: { lte: new Date(Date.now() - ALBUM_QUIET_MS + 200) },
    },
    data: { mediaAckSent: true },
  })

  if (updated.count !== 1) return

  await sendMessageToUser(
    userId,
    chatId,
    `ስዕሎችዎን ተቀብለናል። Our team will follow up. @${humanTelegramUsername()}`
  )
}
