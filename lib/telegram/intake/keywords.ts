const QUOTE_KEYWORDS =
  /\b(quote|price|pricing|how much|cost|move|moving|movers|መጓጓዣ|ዋጋ|ማጓጓዣ)\b/i

export function isQuoteIntent(text: string): boolean {
  const t = text.trim()
  if (t.length < 3) return false
  return QUOTE_KEYWORDS.test(t)
}
