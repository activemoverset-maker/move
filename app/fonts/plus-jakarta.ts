import localFont from 'next/font/local'

export const plusJakartaSans = localFont({
  src: './plus-jakarta-sans-latin.woff2',
  display: 'swap',
  variable: '--font-plus-jakarta',
  preload: false,
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
})
