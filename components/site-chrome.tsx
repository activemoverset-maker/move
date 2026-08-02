import { headers } from 'next/headers'
import { Suspense } from 'react'
import { FloatingButtons } from '@/components/floating-buttons'
import { Header } from '@/components/header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { GlobalLoadingScreen } from '@/components/global-loading-screen'
import { GlobalSEO } from '@/components/seo/global-seo'
import { GoogleAnalytics } from '@/components/google-analytics'
import { LanguageProvider } from '@/contexts/language-context'
import { LoadingProvider } from '@/contexts/loading-context'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/toaster'

async function isMaledActiveSite(): Promise<boolean> {
  const headersList = await headers()
  return headersList.get('x-site-id') === 'maledactive'
}

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const isMaled = await isMaledActiveSite()

  if (isMaled) {
    return (
      <>
        {children}
        <Toaster />
        <Analytics />
      </>
    )
  }

  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <LanguageProvider>
          <Suspense fallback={null}>
            <GlobalLoadingScreen />
          </Suspense>
          <div className="min-h-screen flex flex-col">
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
    </LoadingProvider>
  )
}
