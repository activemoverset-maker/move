"use client"

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

interface ParticleSystemProps {
  className?: string
  particleCount?: number
  colors?: string[]
}

export function ParticleSystem({ 
  className = "", 
  particleCount = 40, // Reduced from 80
  colors = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#ffffff', '#fbbf24']
}: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const [isClient, setIsClient] = useState(false)

  // Memoized colors array for performance
  const memoizedColors = useMemo(() => colors, [colors])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Initialize particles with larger sizes but fewer count
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 6 + 2, // Slightly smaller for performance
      speedX: (Math.random() - 0.5) * 2, // Reduced speed
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.6 + 0.2, // Slightly less opacity
      color: memoizedColors[Math.floor(Math.random() * memoizedColors.length)]
    }))

    // Animation loop with reduced frequency
    let animationId: number
    const animate = () => {
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= rect.width) {
          particle.speedX *= -1
        }
        if (particle.y <= 0 || particle.y >= rect.height) {
          particle.speedY *= -1
        }

        // Wrap around
        if (particle.x < 0) particle.x = rect.width
        if (particle.x > rect.width) particle.x = 0
        if (particle.y < 0) particle.y = rect.height
        if (particle.y > rect.height) particle.y = 0
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newRect = container.getBoundingClientRect()
      particlesRef.current.forEach(particle => {
        particle.x = Math.min(particle.x, newRect.width)
        particle.y = Math.min(particle.y, newRect.height)
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [particleCount, memoizedColors, isClient])

  if (!isClient) {
    return <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particlesRef.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full shadow-lg"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            x: particle.x,
            y: particle.y,
            filter: 'blur(0.3px)' // Reduced blur for performance
          }}
          animate={{
            scale: [1, 1.5, 1], // Reduced scale for performance
            opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity],
            boxShadow: [
              `0 0 8px ${particle.color}30`,
              `0 0 15px ${particle.color}60`,
              `0 0 8px ${particle.color}30`
            ]
          }}
          transition={{
            duration: 5 + Math.random() * 2, // Slower animations
            repeat: -1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
} 
 
 
 