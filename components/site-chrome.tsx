import { Suspense } from 'react'
import { Header } from '@/components/header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { FloatingButtons } from '@/components/floating-buttons'
import { GlobalSEO } from '@/components/seo/global-seo'
import { GoogleAnalytics } from '@/components/google-analytics'
import { LanguageProvider } from '@/contexts/language-context'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/toaster'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LanguageProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </div>
        <FloatingButtons />
        <Toaster />
        <GoogleAnalytics />
        <Analytics />
        <GlobalSEO />
      </LanguageProvider>
    </Suspense>
  )
}
