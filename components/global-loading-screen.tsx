"use client"

import { useLoading } from '@/contexts/loading-context'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function GlobalLoadingScreen() {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const previousPath = useRef<string>('')
  const previousSearch = useRef<string>('')

  // Handle page navigation loading
  useEffect(() => {
    // Skip the first mount to avoid conflicts with initial loading
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousPath.current = pathname
      previousSearch.current = searchParams.toString()
      return
    }

    // Only trigger loading if pathname or search params actually changed
    const currentPath = pathname
    const currentSearch = searchParams.toString()
    
    if (currentPath !== previousPath.current || currentSearch !== previousSearch.current) {
      console.log('Navigation detected, starting loading...')

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Start loading when pathname or search params change
      startLoading()
      
      // Stop loading after a short delay
      timeoutRef.current = setTimeout(() => {
        console.log('Navigation loading complete, stopping...')
        stopLoading()
      }, 800)

      // Update previous values
      previousPath.current = currentPath
      previousSearch.current = currentSearch
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname, searchParams, startLoading, stopLoading])

  // Force stop loading after a maximum time to prevent stuck states
  useEffect(() => {
    if (isLoading) {
      const maxLoadingTime = setTimeout(() => {
        console.log('Force stopping loading after timeout')
        stopLoading()
      }, 5000) // 5 second maximum

      return () => clearTimeout(maxLoadingTime)
    }
  }, [isLoading, stopLoading])

  return <LoadingScreen isLoading={isLoading} />
} 