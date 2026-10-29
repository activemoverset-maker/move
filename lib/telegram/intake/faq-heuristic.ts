/** Detect general questions during the quote wizard (not short address/date answers). */
export function looksLikeFaqQuestion(text: string): boolean {
  const t = text.trim()
  if (t.length < 12) return false
  if (t.includes('?') || t.includes('？')) return true
  if (
    /^(how|what|why|when|where|who|can|could|do|does|is|are|will|should)\b/i.test(t)
  ) {
    return true
  }
  if (/^(ምን|ለምን|እንዴት|መቼ|የት|ማን|እንደ)/.test(t)) {
    return true
  }
  return false
}
