/** List-price estimates for dashboard labels only — not billing truth. */
const ETB_PER_1K_CHAT_TOKENS = 2.5
const ETB_PER_1K_STT_CHARS = 3.5
const ETB_PER_TTS_SECOND = 0.15

export function estimateEtbFromUsage(rows: {
  promptTokens: number | null
  completionTokens: number | null
  sttCharacters: number | null
  ttsSeconds: number | null
}[]): number {
  let chatTokens = 0
  let sttChars = 0
  let ttsSec = 0
  for (const r of rows) {
    chatTokens += (r.promptTokens ?? 0) + (r.completionTokens ?? 0)
    sttChars += r.sttCharacters ?? 0
    ttsSec += r.ttsSeconds ?? 0
  }
  const chatEtb = (chatTokens / 1000) * ETB_PER_1K_CHAT_TOKENS
  const sttEtb = (sttChars / 1000) * ETB_PER_1K_STT_CHARS
  const ttsEtb = ttsSec * ETB_PER_TTS_SECOND
  return Math.round((chatEtb + sttEtb + ttsEtb) * 100) / 100
}
