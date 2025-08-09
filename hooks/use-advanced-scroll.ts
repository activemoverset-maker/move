import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, useSpring } from 'framer-motion'

interface UseAdvancedScrollOptions {
  target?: React.RefObject<HTMLElement>
  offset?: ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"]
  threshold?: number
}

export function useAdvancedScroll(options: UseAdvancedScrollOptions = {}) {
  const { target, offset = ["start end", "end start"], threshold = 0.1 } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [lastScrollY, setLastScrollY] = useState(0)

  const { scrollYProgress } = useScroll({
    target: target || containerRef,
    offset
  })

  // Smooth spring transforms
  const springScrollY = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30 
  })

  // Direction-aware transforms
  const directionAwareY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, scrollDirection === 'down' ? -20 : 20, 0]
  )

  // Parallax effect
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100]
  )

  // Scale effect based on scroll
  const scaleEffect = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.1, 1]
  )

  // Rotation effect
  const rotationEffect = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 5, 0]
  )

  // Opacity fade
  const opacityEffect = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  )

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    const element = target?.current || containerRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [target, threshold])

  return {
    containerRef,
    scrollYProgress,
    springScrollY,
    directionAwareY,
    parallaxY,
    scaleEffect,
    rotationEffect,
    opacityEffect,
    isInView,
    scrollDirection,
    lastScrollY
  }
} 