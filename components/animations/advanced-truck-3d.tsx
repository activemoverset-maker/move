"use client"

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Truck, Package, MapPin, Clock, Star, Shield, Zap, Navigation } from 'lucide-react'

interface AdvancedTruck3DProps {
  className?: string
}

export function AdvancedTruck3D({ className = "" }: AdvancedTruck3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const truckRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Enhanced 3D transforms - truck moves across entire screen with better range
  const truckRotateX = useTransform(scrollYProgress, [0, 1], [0, 15])
  const truckRotateY = useTransform(scrollYProgress, [0, 1], [0, 8])
  const truckTranslateZ = useTransform(scrollYProgress, [0, 1], [0, 50])
  const truckScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const truckX = useTransform(scrollYProgress, [0, 1], [-800, 800]) // Much larger range for full screen movement

  // Spring animations for smooth transitions
  const springRotateX = useSpring(truckRotateX, { stiffness: 100, damping: 30 })
  const springRotateY = useSpring(truckRotateY, { stiffness: 100, damping: 30 })
  const springTranslateZ = useSpring(truckTranslateZ, { stiffness: 100, damping: 30 })
  const springScale = useSpring(truckScale, { stiffness: 100, damping: 30 })
  const springX = useSpring(truckX, { stiffness: 100, damping: 30 })

  // Memoized road lines for performance
  const roadLines = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({ id: i }))
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        ref={containerRef}
        className={`relative perspective-1000 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-black/40" />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative perspective-1000 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-black/40">
        {/* Enhanced Road Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <motion.div 
            className="flex space-x-16"
            animate={{ x: [-200, 200] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {roadLines.map((line) => (
              <div key={line.id} className="w-16 h-1 bg-yellow-400 rounded-full shadow-lg" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sleek Modern Truck */}
      <motion.div
        ref={truckRef}
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          translateZ: springTranslateZ,
          scale: springScale,
          x: springX,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          x: [-80, 80, -60, 60, -80],
          y: [0, -8, 0, -12, 0],
          rotateZ: [0, 1, -1, 2, -2, 0]
        }}
        transition={{
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ 
          scale: 1.15,
          transition: { duration: 0.3 }
        }}
      >
        <div className="relative transform-style-preserve-3d">
          {/* Main Truck Body - Sleek Design */}
          <motion.div 
            className="w-72 h-32 bg-gradient-to-r from-primary via-green-600 to-green-700 rounded-2xl shadow-2xl relative border-2 border-green-800"
            style={{
              transform: 'translateZ(20px)',
              transformStyle: 'preserve-3d'
            }}
            animate={{
              boxShadow: isHovered 
                ? '0 30px 60px rgba(22, 163, 74, 0.4), 0 0 40px rgba(22, 163, 74, 0.3)' 
                : '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(22, 163, 74, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Sleek Truck Cabin */}
            <motion.div 
              className="absolute -top-16 left-4 w-28 h-20 bg-gradient-to-r from-primary to-green-600 rounded-t-2xl border-2 border-green-800 shadow-xl"
              style={{ transform: 'translateZ(30px)' }}
              animate={{
                boxShadow: isHovered 
                  ? '0 15px 30px rgba(22, 163, 74, 0.3)' 
                  : '0 10px 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Clean Windows */}
              <div className="absolute top-3 left-3 w-8 h-6 bg-blue-400/80 rounded-sm border border-blue-300">
                <div className="w-2 h-2 bg-white/60 rounded-sm absolute top-1 left-1"></div>
              </div>
              <div className="absolute top-3 right-3 w-8 h-6 bg-blue-400/80 rounded-sm border border-blue-300">
                <div className="w-2 h-2 bg-white/60 rounded-sm absolute top-1 left-1"></div>
              </div>
              <div className="absolute top-12 left-3 w-8 h-6 bg-blue-400/80 rounded-sm border border-blue-300">
                <div className="w-2 h-2 bg-white/60 rounded-sm absolute top-1 left-1"></div>
              </div>
              <div className="absolute top-12 right-3 w-8 h-6 bg-blue-400/80 rounded-sm border border-blue-300">
                <div className="w-2 h-2 bg-white/60 rounded-sm absolute top-1 left-1"></div>
              </div>
              
              {/* Driver */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-300"></div>
            </motion.div>

            {/* Modern Wheels */}
            <motion.div 
              className="absolute -bottom-6 left-10 w-16 h-16 bg-gray-900 rounded-full border-4 border-gray-700 shadow-lg"
              style={{ transform: 'translateZ(10px)' }}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
            >
              <div className="absolute inset-2 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="absolute inset-4 bg-gray-700 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-6 right-10 w-16 h-16 bg-gray-900 rounded-full border-4 border-gray-700 shadow-lg"
              style={{ transform: 'translateZ(10px)' }}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
            >
              <div className="absolute inset-2 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="absolute inset-4 bg-gray-700 rounded-full"></div>
            </motion.div>

            {/* Modern Lights */}
            <motion.div 
              className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
              style={{ transform: 'translateZ(40px)' }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
                boxShadow: ['0 0 10px rgba(255, 255, 0, 0.5)', '0 0 20px rgba(255, 255, 0, 0.8)', '0 0 10px rgba(255, 255, 0, 0.5)']
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full shadow-lg"
              style={{ transform: 'translateZ(40px)' }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
                boxShadow: ['0 0 10px rgba(255, 0, 0, 0.5)', '0 0 20px rgba(255, 0, 0, 0.8)', '0 0 10px rgba(255, 0, 0, 0.5)']
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />

            {/* Company Logo on Truck */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30 text-center shadow-lg">
                <img 
                  src="/images/logo.jpg" 
                  alt="Active Movers Logo" 
                  className="w-16 h-8 rounded-lg object-cover shadow-md"
                />
              </div>
            </motion.div>

            {/* Simple Exhaust */}
            <motion.div 
              className="absolute -bottom-12 left-20 w-3 h-8 bg-gray-600 rounded-b"
              style={{ transform: 'translateZ(10px)' }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0.5, 1.5, 0.5],
                filter: 'blur(2px)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Floating Packages - Clean Design */}
          <motion.div
            className="absolute -top-12 -left-8 w-16 h-16 bg-orange-500 rounded-xl shadow-2xl border-2 border-orange-600"
            style={{ transform: 'translateZ(60px)' }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Package className="w-8 h-8 text-white mx-auto mt-2" />
          </motion.div>

          <motion.div
            className="absolute -top-8 -right-12 w-20 h-20 bg-blue-500 rounded-xl shadow-2xl border-2 border-blue-600"
            style={{ transform: 'translateZ(50px)' }}
            animate={{
              y: [20, -20, 20],
              rotate: [360, 180, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            <Package className="w-10 h-10 text-white mx-auto mt-2" />
          </motion.div>

          <motion.div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-xl shadow-2xl border-2 border-green-600"
            style={{ transform: 'translateZ(40px)' }}
            animate={{
              y: [-10, 10, -10],
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <Package className="w-6 h-6 text-white mx-auto mt-1" />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Road Elements */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent"
        style={{ transform: 'translateZ(5px)' }}
      >
        <motion.div 
          className="flex space-x-8"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {roadLines.map((line) => (
            <div key={line.id} className="w-12 h-1 bg-yellow-400 rounded-full shadow-md" />
          ))}
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      {/* <motion.div
        className="absolute top-10 left-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30"
        style={{ transform: 'translateZ(50px)' }}
        whileHover={{ scale: 1.05, rotateY: 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-gray-800">Fast Delivery</div>
            <div className="text-sm text-gray-600">Same Day Service</div>
          </div>
        </div>
      </motion.div> */}

      {/* <motion.div
        className="absolute top-20 right-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30"
        style={{ transform: 'translateZ(40px)' }}
        whileHover={{ scale: 1.05, rotateY: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-500" />
          <div>
            <div className="font-semibold text-gray-800">Secure Moving</div>
            <div className="text-sm text-gray-600">Fully Insured</div>
          </div>
        </div>
      </motion.div> */}

      {/* Particle Trail */}
      {/* <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'translateZ(10px)'
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div> */}
    </div>
  )
}
