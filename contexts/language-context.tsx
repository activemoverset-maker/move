"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Language, getTranslation } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  switchLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check URL parameter first
    const urlLang = searchParams.get('lang') as Language
    if (urlLang && (urlLang === 'en' || urlLang === 'am')) {
      setLanguageState(urlLang)
      localStorage.setItem('language', urlLang)
      return
    }

    // Fall back to localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
      setLanguageState(savedLanguage)
    }
  }, [searchParams])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    // Update document direction for RTL languages if needed
    if (lang === 'am') {
      document.documentElement.setAttribute('dir', 'ltr') // Amharic is LTR
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }

  const switchLanguage = (lang: Language) => {
    setLanguage(lang)
    
    // Update URL with language parameter
    const params = new URLSearchParams(searchParams.toString())
    if (lang === 'en') {
      params.delete('lang')
    } else {
      params.set('lang', lang)
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 
 
 
 