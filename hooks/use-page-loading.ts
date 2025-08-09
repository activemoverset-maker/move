import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoading } from '@/contexts/loading-context'

export function usePageLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startLoading, stopLoading } = useLoading()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const previousPath = useRef<string>('')
  const previousSearch = useRef<string>('')

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

  return { startLoading, stopLoading }
} 