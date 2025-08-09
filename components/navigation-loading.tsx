"use client"

import { useEffect } from 'react'
import { useLoading } from '@/contexts/loading-context'

interface NavigationLoadingProps {
  trigger?: boolean
  delay?: number
}

export function NavigationLoading({ trigger = true, delay = 1500 }: NavigationLoadingProps) {
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    if (trigger) {
      startLoading()
      
      const timer = setTimeout(() => {
        stopLoading()
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [trigger, delay, startLoading, stopLoading])

  return null
} 