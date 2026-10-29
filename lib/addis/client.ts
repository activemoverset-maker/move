import AddisAI from 'addisai'
import { buildSystemPrompt } from '@/lib/addis/playbook'
import { randomUUID } from 'crypto'

let client: AddisAI | null = null

function getAddis(): AddisAI {
  if (!client) {
    const apiKey = process.env.ADDIS_API_KEY
    if (!apiKey) throw new Error('ADDIS_API_KEY is not configured')
    client = new AddisAI({ apiKey, timeout: 95_000 })
  }
  return client
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export function detectTargetLanguage(text: string): 'am' | 'en' {
  if (/[\u1200-\u137F]/.test(text)) return 'am'
  if (/[A-Za-z]/.test(text) && !/[\u1200-\u137F]/.test(text)) return 'en'
  return 'am'
}

export async function addisChat(
  messages: ChatMessage[],
  targetLanguage: 'am' | 'en'
): Promise<{ text: string; promptTokens?: number; completionTokens?: number; finishReason?: string }> {
  const addis = getAddis()
  let system = buildSystemPrompt()
  if (targetLanguage === 'en') {
    system += '\n\nThe customer wrote in English. Reply in clear English.'
  }

  const response = await addis.chat.completions.create({
    language: 'am',
    persona: 'You are the Active Movers customer assistant on Telegram.',
    system,
    messages,
    temperature: 0.2,
    max_tokens: 512,
  })

  const choice = response.choices?.[0]
  const text = (choice?.message?.content || '').trim()
  const usage = response.usage

  return {
    text,
    promptTokens: usage?.prompt_tokens,
    completionTokens: usage?.completion_tokens,
    finishReason: choice?.finish_reason ?? undefined,
  }
}

export async function addisTranscribeVoice(
  audioBuffer: Buffer,
  requestId: string
): Promise<{ text: string; characters?: number }> {
  const addis = getAddis()
  const audio = new File([audioBuffer], 'voice.ogg', { type: 'audio/ogg' })
  const result = await addis.scribe.transcribe({
    audio,
    backend: 'turbo',
    requestId,
  })
  const text = (result.text || '').trim()
  return { text, characters: result.usage?.creditsUsed }
}

export async function addisGenerateVoice(
  script: string,
  clientRequestId: string,
  language: 'am' | 'en' = 'am'
): Promise<{ audio: Buffer; seconds?: number }> {
  const addis = getAddis()
  const voiceId = process.env.ADDIS_VOICE_ID || 'am-hamen'
  const lang = language === 'en' ? 'am' : 'am'

  const est = await addis.voice.estimate({ voiceId, text: script, language: lang })
  if (!est.canGenerate) {
    throw new Error('TTS wallet insufficient')
  }

  const clip = await addis.voice.generate({
    text: script,
    voiceId,
    language: lang,
    outputFormat: 'mp3_44100',
    clientRequestId: clientRequestId || randomUUID(),
  })

  const arrayBuffer = await clip.arrayBuffer()
  const audio = Buffer.from(arrayBuffer)

  return { audio, seconds: clip.durationSeconds ?? undefined }
}
