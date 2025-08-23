"use client"

import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === 'am' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('am')}
        className="text-xs"
      >
        አማ
      </Button>
    </div>
  )
} 
 
 
 