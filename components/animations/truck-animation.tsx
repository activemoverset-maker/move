"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Truck, Package, MapPin, Clock, Star } from 'lucide-react'

interface TruckAnimationProps {
  className?: string
}

export function TruckAnimation({ className = "" }: TruckAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const truckRef = useRef<HTMLDivElement>(null)
  const packageRef = useRef<HTMLDivElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const truckX = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const truckY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, 0])
  const truckRotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0])
  const packageY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, -30, -30, 0])
  const packageScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.2, 1])

  const springTruckX = useSpring(truckX, { stiffness: 100, damping: 30 })
  const springTruckY = useSpring(truckY, { stiffness: 50, damping: 20 })
  const springTruckRotation = useSpring(truckRotation, { stiffness: 100, damping: 30 })

  // Register GSAP plugins
  useEffect(() => {
    setIsClient(true)
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    // Create floating packages animation
    const packages = gsap.utils.toArray('.floating-package')
    
    packages.forEach((pkg: any, index: number) => {
      gsap.to(pkg, {
        y: -20,
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.3
      })
    })

    // Create road animation
    if (roadRef.current) {
      gsap.to(roadRef.current, {
        x: -100,
        duration: 3,
        repeat: -1,
        ease: "none"
      })
    }

    // Create truck bounce animation
    if (truckRef.current) {
      gsap.to(truckRef.current, {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }

    // Create scroll-triggered animations
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => {
        const progress = self.progress
        if (truckRef.current) {
          gsap.to(truckRef.current, {
            scale: 1 + progress * 0.1,
            duration: 0.1
          })
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isClient])

  if (!isClient) {
    return <div ref={containerRef} className={`relative overflow-hidden ${className}`} />
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200">
        {/* Floating Clouds */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-10 bg-white/30 rounded-full"
          animate={{
            x: [0, 50, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: -1,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-16 h-8 bg-white/40 rounded-full"
          animate={{
            x: [0, -30, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: -1,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Road */}
      <div ref={roadRef} className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800 transform -skew-y-1">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2 bg-yellow-400 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Truck */}
      <motion.div
        ref={truckRef}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10"
        style={{
          x: springTruckX,
          y: springTruckY,
          rotate: springTruckRotation
        }}
      >
        <div className="relative">
          {/* Truck Body */}
          <div className="w-32 h-16 bg-primary rounded-lg shadow-lg relative">
            {/* Truck Cabin */}
            <div className="absolute -top-8 left-2 w-12 h-8 bg-primary rounded-t-lg">
              <div className="w-2 h-2 bg-white/50 rounded-full absolute top-1 left-1"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full absolute top-1 right-1"></div>
            </div>
            
            {/* Truck Wheels */}
            <div className="absolute -bottom-2 left-4 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700"></div>
            <div className="absolute -bottom-2 right-4 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700"></div>
            
            {/* Truck Lights */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            
            {/* Company Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AM</span>
            </div>
          </div>

          {/* Exhaust */}
          <motion.div
            className="absolute -bottom-4 left-8 w-1 h-4 bg-gray-600"
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: -1,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Floating Packages */}
      <motion.div
        ref={packageRef}
        className="floating-package absolute top-20 left-1/4 z-5"
        style={{
          y: packageY,
          scale: packageScale
        }}
      >
        <div className="w-8 h-8 bg-orange-500 rounded shadow-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="floating-package absolute top-32 right-1/4 z-5"
        style={{
          y: packageY,
          scale: packageScale
        }}
      >
        <div className="w-10 h-10 bg-blue-500 rounded shadow-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="floating-package absolute top-16 left-1/3 z-5"
        style={{
          y: packageY,
          scale: packageScale
        }}
      >
        <div className="w-6 h-6 bg-green-500 rounded shadow-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-3 h-3 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Interactive Elements */}
      <motion.div
        className="absolute top-10 left-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-gray-700">Addis Ababa</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-gray-700">24/7 Service</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-medium text-gray-700">5-Star Rated</span>
        </div>
      </motion.div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: -1,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: -1,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{
              y: [0, 12, 0]
            }}
            transition={{
              duration: 2,
              repeat: -1,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  )
} 