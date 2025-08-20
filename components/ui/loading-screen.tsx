"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
  onLoadingComplete?: () => void
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showScreen, setShowScreen] = useState(false)

  useEffect(() => {
    // Set window size for floating elements
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setShowScreen(true)
    } else {
      // Add a small delay before hiding to ensure smooth transition
      const timer = setTimeout(() => {
        setShowScreen(false)
        onLoadingComplete?.()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, onLoadingComplete])

  // Safety mechanism: force hide after 10 seconds
  useEffect(() => {
    if (showScreen) {
      const safetyTimer = setTimeout(() => {
        console.log('Safety timer: forcing loading screen to hide')
        setShowScreen(false)
      }, 10000)
      return () => clearTimeout(safetyTimer)
    }
  }, [showScreen])

  // Don't render anything if not showing
  if (!showScreen) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-40"
          />
          
          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                scale: 0
              }}
              animate={{ 
                opacity: [0, 1, 0],
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
            />
          ))}
        </div>

        <div className="relative z-10 text-center w-full">
          {/* Driving simulation: logo moves across screen with suspension, speed trails, and shadow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative mb-8 w-full"
          >
            {/* Moving vehicle container */}
            <motion.div
              key={windowSize.width}
              initial={{ x: -Math.max(240, windowSize.width * 0.45), y: 0 }}
              animate={{
                x: [
                  -Math.max(240, windowSize.width * 0.45),
                  Math.max(240, windowSize.width * 0.45),
                  -Math.max(240, windowSize.width * 0.45)
                ],
                y: [0, -6, 0, -6, 0],
                rotate: [0, 1.5, 0, -1.5, 0],
              }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto"
              style={{ height: '140px' }}
            >
              {/* Speed trails behind the logo */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scaleX: 0, x: -40 - i * 14, y: 40 + i * 4 }}
                  animate={{ opacity: [0.0, 0.5, 0], scaleX: [0, 1, 0], x: [-40 - i * 14, -80 - i * 18, -120 - i * 22] }}
                  transition={{ duration: 1.2 + i * 0.1, repeat: Infinity, ease: "easeOut", delay: i * 0.15 }}
                  className="absolute h-1.5 w-24 origin-left bg-white/50 rounded-full blur-[1px]"
                />
              ))}

              {/* Exhaust/dust puffs */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`dust-${i}`}
                  initial={{ opacity: 0.3, scale: 0, x: -30 - i * 6, y: 70 + i * 4 }}
                  animate={{ opacity: [0.3, 0.15, 0], scale: [0, 1, 1.4], x: [-30 - i * 6, -60 - i * 10] }}
                  transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, ease: "easeOut", delay: 0.2 * i }}
                  className="absolute w-3 h-3 bg-white/30 rounded-full blur-sm"
                />
              ))}

              {/* Vehicle (logo) */}
              <motion.div
                animate={{ y: [0, -2, 0, 2, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mx-auto"
              >
                <Image
                  src="/images/logotr.png"
                  alt="Active Movers & Packers"
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  priority
                />
                {/* Underbody shadow */}
                <motion.div
                  animate={{ scaleX: [0.9, 1.05, 0.9], opacity: [0.35, 0.5, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-24 h-3 bg-black/40 blur-md rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced loading text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-3 mb-8"
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Active Movers & Packers
            </motion.h2>
            <motion.p 
              className="text-white/90 text-base sm:text-lg font-medium"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              Loading your experience...
            </motion.p>
          </motion.div>

          {/* Enhanced loading dots */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center space-x-2 mb-8"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 1.4,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg"
              />
            ))}
          </motion.div>

          {/* Enhanced progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="max-w-sm mx-auto"
          >
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Loading percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-4"
          >
            <motion.span
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-white/80 text-sm font-medium"
            >
              Preparing your journey...
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 