/**
 * Usage: TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... npx tsx scripts/telegram-set-webhook.ts
 * Optional: WEBHOOK_URL=https://www.activemoverset.com/api/telegram/webhook
 */

const token = process.env.TELEGRAM_BOT_TOKEN
const secret = process.env.TELEGRAM_WEBHOOK_SECRET
const url =
  process.env.WEBHOOK_URL || 'https://www.activemoverset.com/api/telegram/webhook'

if (!token || !secret) {
  console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET')
  process.exit(1)
}

async function main() {
  const setRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ['message', 'callback_query'],
      max_connections: 10,
      drop_pending_updates: false,
    }),
  })
  console.log('setWebhook', await setRes.json())

  const cmdRes = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [
        { command: 'start', description: 'Welcome & main menu' },
        { command: 'help', description: 'How to use the bot' },
        { command: 'cancel', description: 'Cancel quote wizard' },
        { command: 'quote', description: 'Start moving quote wizard' },
      ],
    }),
  })
  console.log('setMyCommands', await cmdRes.json())

  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
  console.log('getWebhookInfo', await infoRes.json())
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
