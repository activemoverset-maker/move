"use client"

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Truck, Package, MapPin, Clock, Star, Shield } from 'lucide-react'

interface ScrollTriggeredAnimationsProps {
  className?: string
}

export function ScrollTriggeredAnimations({ className = "" }: ScrollTriggeredAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform values based on scroll progress
  const truckScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.2, 1])
  const truckRotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 15, 0])
  const packageY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, -50, -50, 0])
  const packageRotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 360, 720])
  const roadSpeed = useTransform(scrollYProgress, [0, 1], [1, 3])
  const particleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  // Spring animations for smoother transitions
  const springTruckScale = useSpring(truckScale, { stiffness: 100, damping: 30 })
  const springTruckRotation = useSpring(truckRotation, { stiffness: 50, damping: 20 })
  const springPackageY = useSpring(packageY, { stiffness: 100, damping: 30 })
  const springPackageRotation = useSpring(packageRotation, { stiffness: 100, damping: 30 })

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Floating Icons with Scroll Response */}
      <motion.div
        className="absolute top-20 left-10 z-20"
        style={{ scale: springTruckScale }}
        whileHover={{ scale: 1.2, rotate: 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <Truck className="w-6 h-6 text-primary" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 z-20"
        style={{ y: springPackageY, rotate: springPackageRotation }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <Package className="w-6 h-6 text-orange-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-60 left-1/4 z-20"
        style={{ rotate: springTruckRotation }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <MapPin className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-80 right-1/3 z-20"
        style={{ scale: springTruckScale }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <Clock className="w-6 h-6 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 left-1/2 z-20"
        style={{ y: springPackageY }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-72 right-10 z-20"
        style={{ rotate: springTruckRotation }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <Shield className="w-6 h-6 text-purple-500" />
        </div>
      </motion.div>

      {/* Animated Road Lines */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden"
        style={{ scaleX: roadSpeed }}
      >
        <div className="flex space-x-8">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-16 h-1 bg-yellow-400"
              animate={{
                x: [-100, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: -1,
                delay: i * 0.1,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll-Responsive Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: particleOpacity }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, 20, -20],
              scale: [0.5, 1, 0.5],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: -1,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Interactive Hover Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-primary/10 to-transparent rounded-full"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + i * 8}%`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: -1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
} 
 
 
 