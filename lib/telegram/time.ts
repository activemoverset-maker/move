/** Ethiopia uses UTC+3 year-round (no DST). */
export function addisAbabaDayBounds(reference = new Date()): { start: Date; end: Date } {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Addis_Ababa',
  }).format(reference)
  const start = new Date(`${dateParts}T00:00:00+03:00`)
  const end = new Date(`${dateParts}T23:59:59.999+03:00`)
  return { start, end }
}
