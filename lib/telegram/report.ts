import { prisma } from '@/lib/prisma'
import { humanTelegramLink, humanTelegramUsername, sendMessage, telegramApi } from '@/lib/telegram/bot'
import { formatIntakeBlock } from '@/lib/telegram/intake/format'
import { parseIntakeData } from '@/lib/telegram/intake/types'
import { intakeMeetsReportMinimum } from '@/lib/telegram/intake/validate'

type HandoffReason = 'needs_quote' | 'asked_for_human' | 'limit_reached' | 'intake_complete'

export async function postStaffShortUpdate(
  sessionId: string,
  line: string
): Promise<void> {
  const staffGroupId = process.env.TELEGRAM_STAFF_GROUP_ID
  if (!staffGroupId) return

  const session = await prisma.telegramSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })
  if (!session) return

  const user = session.user
  const body = [
    'Active Movers — Telegram update',
    line,
    `Session: ${session.id}`,
    user.displayName || user.firstName || '—',
    user.username ? `@${user.username}` : `id ${user.telegramUserId}`,
  ].join('\n')

  await sendMessage(staffGroupId, body)
}

export async function maybePostStaffReport(
  sessionId: string,
  reason: HandoffReason
): Promise<void> {
  const staffGroupId = process.env.TELEGRAM_STAFF_GROUP_ID
  if (!staffGroupId) {
    console.error('TELEGRAM_STAFF_GROUP_ID not set; skipping staff report')
    return
  }

  const session = await prisma.telegramSession.findUnique({
    where: { id: sessionId },
    include: {
      user: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
  if (!session || session.handoffAt) return

  if (reason === 'needs_quote' && !session.phone) return

  const intake = parseIntakeData(session.intakeData)
  const mediaCount = await prisma.telegramMessage.count({
    where: { sessionId, kind: { in: ['photo', 'video'] } },
  })
  if (reason === 'intake_complete') {
    if (!intakeMeetsReportMinimum(intake, session.phone, mediaCount)) return
  }

  const user = session.user
  const counted24h = await prisma.telegramMessage.count({
    where: {
      userId: user.id,
      countsTowardLimit: true,
      createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })

  const lines = session.messages
    .slice()
    .reverse()
    .map((m) => `[${m.role}] ${(m.text || m.kind).slice(0, 200)}`)

  const intakeBlock =
    reason === 'intake_complete' || session.intakeData
      ? formatIntakeBlock(intake, session.phone)
      : ''

  const body = [
    'Active Movers — Telegram handoff',
    `Session: ${session.id}`,
    `Reason: ${reason}`,
    `Name: ${user.displayName || user.firstName || '—'}`,
    user.username ? `@${user.username}` : 'no username',
    `Telegram id: ${user.telegramUserId}`,
    `Phone: ${session.phone || 'no phone'}`,
    `Answers (24h): ${counted24h}/20`,
    '',
    ...(intakeBlock ? [intakeBlock, ''] : []),
    'Recent:',
    ...lines,
    '',
    `Customer should message @${humanTelegramUsername()} or call ${session.phone || 'see chat'}`,
    humanTelegramLink(),
  ].join('\n')

  const sent = await sendMessage(staffGroupId, body)

  const mediaMessages = await prisma.telegramMessage.findMany({
    where: {
      sessionId,
      kind: { in: ['photo', 'video'] },
      fileId: { not: null },
    },
    orderBy: { createdAt: 'asc' },
  })

  for (const msg of mediaMessages) {
    if (!msg.fileId) continue
    try {
      await telegramApi('copyMessage', {
        chat_id: staffGroupId,
        from_chat_id: user.chatId,
        message_id: Number(msg.telegramMessageId),
      })
    } catch (e) {
      console.error('copyMessage failed:', e)
    }
  }

  await prisma.telegramSession.update({
    where: { id: sessionId },
    data: {
      handoffAt: new Date(),
      handoffReason: reason,
      staffMessageId: String(sent.message_id),
    },
  })
}

/** After a full handoff: more photos or another human request — no duplicate full report. */
export async function notifyStaffFollowUp(
  sessionId: string,
  kind: 'more_media' | 'human_again'
): Promise<void> {
  const line =
    kind === 'more_media'
      ? 'Customer sent more photos/videos for this session.'
      : 'Customer asked for a person again.'
  await postStaffShortUpdate(sessionId, line)
}
