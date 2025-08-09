"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show initial loading for 2 seconds, then stop
    const timer = setTimeout(() => {
      console.log('Initial loading complete')
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const startLoading = () => {
    console.log('Starting loading...')
    setIsLoading(true)
  }
  
  const stopLoading = () => {
    console.log('Stopping loading...')
    setIsLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      startLoading, 
      stopLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 