"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Share2, Filter, Eye, Heart, Sparkles, Zap, Star, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { getRandomizedGalleryImages, type GalleryImage } from '@/lib/gallery-utils'

const CATEGORIES = [
  { id: 'all', label: 'All', labelAm: 'ሁሉም' },
  { id: 'Moving Services', label: 'Moving', labelAm: 'መጓጓዣ' },
  { id: 'Commercial', label: 'Commercial', labelAm: 'ንግድ' },
  { id: 'Packaging', label: 'Packaging', labelAm: 'መጠን' },
  { id: 'Storage', label: 'Storage', labelAm: 'የማከማቻ' },
  { id: 'Team', label: 'Team', labelAm: 'ቡድን' }
]

// Desktop-specific animation variants for image swapping
const desktopContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
}

const desktopItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 100, 
    scale: 0.8,
    rotateX: -20,
    rotateY: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 120,
      damping: 12
    }
  },
  swap: {
    scale: [1, 1.1, 1],
    rotateY: [0, 10, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
}

// Mobile-specific animation variants with complex scroll animations
const mobileContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const mobileItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -100,
    y: 50,
    scale: 0.8,
    rotateZ: -10
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
}

// Advanced mobile scroll animations with sophisticated effects
const mobileScrollVariants = {
  offscreen: {
    opacity: 0,
    scale: 0.85,
    rotateY: -15,
    rotateX: 5,
    x: -80,
    y: 20,
    filter: "blur(5px) brightness(0.7)",
    boxShadow: "0 0 0 rgba(0,0,0,0)"
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    x: 0,
    y: 0,
    filter: "blur(0px) brightness(1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    transition: {
      duration: 1.0,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const mobileImageVariants = {
  offscreen: {
    scale: 1.1,
    rotate: 2,
    filter: "brightness(0.85) contrast(1.05)",
    transformOrigin: "center center"
  },
  onscreen: {
    scale: 1,
    rotate: 0,
    filter: "brightness(1) contrast(1)",
    transformOrigin: "center center",
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Advanced mobile parallax and interactive animations
const mobileParallaxVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    scale: 0.9
  },
  onscreen: (custom: number) => ({
    y: custom * 0.3,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
}

const mobileStaggerVariants = {
  offscreen: {
    opacity: 0,
    x: -100,
    rotateZ: -5
  },
  onscreen: (custom: number) => ({
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: {
      duration: 0.8,
      delay: custom * 0.06,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
}

const mobileHoverVariants = {
  rest: {
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    y: 0,
    filter: "brightness(1)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    scale: 1.03,
    rotateY: 3,
    rotateX: 1,
    y: -8,
    filter: "brightness(1.08) saturate(1.05)",
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  tap: {
    scale: 0.99,
    rotateY: 1,
    rotateX: 0.5,
    y: -3,
    filter: "brightness(1.03)",
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
}

const mobileOverlayVariants = {
  offscreen: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  onscreen: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const mobileShimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    opacity: [0, 1, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const mobilePulseVariants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Image swap animation variants
const imageSwapVariants = {
  initial: { 
    scale: 1, 
    rotateY: 0,
    filter: "brightness(1)"
  },
  swap: { 
    scale: [1, 1.05, 1], 
    rotateY: [0, 5, 0],
    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
}

// Floating animations for desktop
const floatingVariants = {
  animate: {
    y: [-8, 8, -8],
    rotate: [0, 3, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const sparkleVariants = {
  animate: {
    rotate: [0, 360],
    scale: [0.8, 1.2, 0.8],
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Continuous animation variants
const continuousFloatVariants = {
  animate: {
    y: [-5, 5, -5],
    x: [-3, 3, -3],
    rotate: [0, 2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const breathingVariants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

const waveVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export function GallerySection() {
  const { language } = useLanguage()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [isAutoShuffling, setIsAutoShuffling] = useState(true)
  const [shuffleCount, setShuffleCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Parallax effects for desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const headerScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true)
      try {
        const galleryImages = await getRandomizedGalleryImages()
        setImages(galleryImages)
        setFilteredImages(galleryImages)
      } catch (error) {
        console.error('Error loading gallery images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Filter images by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(images)
    } else {
      const filtered = images.filter(img => img.category === activeCategory)
      setFilteredImages(filtered)
    }
  }, [activeCategory, images])

  // Auto-shuffle functionality for desktop only
  const shuffleGallery = () => {
    if (!isMobile) {
      const shuffled = [...filteredImages].sort(() => Math.random() - 0.5)
      setFilteredImages(shuffled)
      setShuffleCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (isAutoShuffling && !isMobile) {
      shuffleIntervalRef.current = setInterval(shuffleGallery, 20000) // Shuffle every 20 seconds
    } else {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current)
        shuffleIntervalRef.current = null
      }
    }

    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current)
      }
    }
  }, [isAutoShuffling, isMobile, filteredImages])

  const toggleAutoShuffle = () => {
    setIsAutoShuffling(!isAutoShuffling)
  }

  const getHeightClass = (height: string, index: number) => {
    // Create more varied sizes based on height and index for better visual balance
    if (isMobile) {
      // Mobile: simpler height variations
      const mobileHeights = ['h-48', 'h-56', 'h-64', 'h-40'];
      return mobileHeights[index % mobileHeights.length];
    }
    
    // Desktop: more complex grid spans
    switch (height) {
      case 'short': return index % 5 === 0 ? 'row-span-1 col-span-1' : 'row-span-1'
      case 'medium': return index % 7 === 0 ? 'row-span-2 col-span-2' : 'row-span-2'
      case 'tall': return index % 9 === 0 ? 'row-span-3 col-span-1' : 'row-span-3'
      default: 
        // Mix of sizes for better visual variety
        if (index % 8 === 0) return 'row-span-2 col-span-2' // Large square
        if (index % 6 === 0) return 'row-span-1 col-span-2' // Wide rectangle
        if (index % 4 === 0) return 'row-span-3 col-span-1' // Tall rectangle
        return 'row-span-2' // Standard size
    }
  }

  const nextImage = () => {
    if (selectedImage) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
      const nextIndex = (currentIndex + 1) % filteredImages.length
      setSelectedImage(filteredImages[nextIndex])
    }
  }

  const prevImage = () => {
    if (selectedImage) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
      const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
      setSelectedImage(filteredImages[prevIndex])
    }
  }

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image)
    trackEvent({ 
      action: 'gallery_image_click', 
      category: 'gallery', 
      label: image.title 
    })
  }

  const handleShare = async () => {
    if (selectedImage && navigator.share) {
      try {
        await navigator.share({
          title: selectedImage.title,
          text: selectedImage.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Animated Background for Desktop */}
      {!isMobile && (
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full"
          />
          <motion.div
            variants={sparkleVariants}
            animate="animate"
            className="absolute top-40 right-20 w-6 h-6 bg-yellow-400/30 rounded-full"
          />
          <motion.div
            variants={continuousFloatVariants}
            animate="animate"
            className="absolute bottom-40 left-1/4 w-3 h-3 bg-blue-400/20 rounded-full"
          />
          <motion.div
            variants={waveVariants}
            animate="animate"
            className="absolute top-1/3 right-1/3 w-5 h-5 bg-green-400/25 rounded-full"
          />
        </motion.div>
      )}

      {/* Mobile-specific animated background elements */}
      {isMobile && (
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            variants={mobilePulseVariants}
            animate="animate"
            className="absolute top-10 left-5 w-2 h-2 bg-primary/30 rounded-full"
          />
          <motion.div
            variants={mobileShimmerVariants}
            animate="animate"
            className="absolute top-20 right-8 w-3 h-3 bg-yellow-400/40 rounded-full"
          />
          <motion.div
            variants={mobilePulseVariants}
            animate="animate"
            className="absolute bottom-20 left-8 w-2 h-2 bg-blue-400/30 rounded-full"
          />
          <motion.div
            variants={sparkleVariants}
            animate="animate"
            className="absolute top-1/2 right-5 w-2 h-2 bg-green-400/35 rounded-full"
          />
          <motion.div
            variants={mobileShimmerVariants}
            animate="animate"
            className="absolute bottom-10 right-10 w-3 h-3 bg-purple-400/25 rounded-full"
          />
        </motion.div>
      )}

      <div className="container-max relative z-10">
        {/* Enhanced Header with Parallax for Desktop */}
        <motion.div
          ref={headerRef}
          style={{ y: headerY, scale: headerScale }}
          className="text-center py-20 lg:py-32"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="w-3 h-3 bg-primary rounded-full"
            />
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-base font-semibold shadow-lg">
              {language === 'en' ? 'Our Gallery' : 'የእኛ ጋለሪ'}
            </Badge>
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="w-3 h-3 bg-primary rounded-full"
            />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent mb-10 leading-tight"
          >
            {language === 'en' ? 'Our Work in Action' : 'የእኛ ስራ በተግባር'}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed px-4"
          >
            {language === 'en' 
              ? 'Explore our professional moving services through our stunning photo gallery. See our dedicated team in action, delivering exceptional service with care and precision.'
              : 'የእኛን የሙያ መጓጓዣ አገልግሎቶች በአስደናቂ ፎቶ ጋለሪያችን ውስጥ ያስሱ። ተሳላሰ ቡድንን በተግባር ይመልከቱ፣ ልዩ አገልግሎት በጥንቃቄ እና በትክክለኛነት እያቀረቡ።'
            }
          </motion.p>

          {/* Auto-shuffle indicator - Desktop only */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 flex items-center justify-center gap-3"
            >
              <motion.div
                variants={breathingVariants}
                animate="animate"
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary/20"
              >
                <Shuffle className={`w-4 h-4 ${isAutoShuffling ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Live Image Swap' : 'የሕያው ምስል ማደባለቅ'}
                </span>
                <Button
                  size="sm"
                  variant={isAutoShuffling ? "default" : "secondary"}
                  onClick={toggleAutoShuffle}
                  className="ml-2 h-6 px-3 text-xs"
                >
                  {isAutoShuffling ? 'ON' : 'OFF'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 md:mb-20 px-4"
        >
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: isMobile ? 0 : 5,
                rotateX: isMobile ? 0 : 5,
                y: isMobile ? -2 : -5,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                delay: index * 0.1 + 0.8, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 transform perspective-1000 text-sm md:text-base ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl shadow-primary/30 scale-105'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-primary border-2 border-gray-200 hover:border-primary/50 shadow-lg hover:shadow-xl backdrop-blur-sm'
              }`}
            >
              <span className="relative z-10">
                {language === 'en' ? category.label : category.labelAm}
              </span>
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl md:rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Gallery Grid - Different animations for desktop and mobile */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center items-center h-64"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${shuffleCount}-${isMobile}`}
              variants={isMobile ? mobileContainerVariants : desktopContainerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-4 md:gap-6 lg:gap-8 mb-20 px-4 ${
                isMobile 
                  ? 'grid-cols-1 space-y-4' 
                  : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px]'
              }`}
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={isMobile ? mobileStaggerVariants : desktopItemVariants}
                  initial={isMobile ? "offscreen" : "hidden"}
                  whileInView={isMobile ? "onscreen" : "visible"}
                  viewport={{ once: true, amount: 0.15 }}
                  custom={index}
                  whileHover={isMobile ? "hover" : { 
                    y: -20, 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    transition: { 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }
                  }}
                  whileTap={isMobile ? "tap" : undefined}
                  onHoverStart={() => setHoveredImage(image.id)}
                  onHoverEnd={() => setHoveredImage(null)}
                  className={`group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl transition-all duration-500 bg-white transform perspective-1000 ${getHeightClass(image.height, index)}`}
                >
                  {/* Continuous breathing animation - Desktop only */}
                  {!isMobile && (
                    <motion.div
                      variants={breathingVariants}
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl"
                    />
                  )}
                  
                  <div className="relative w-full h-full overflow-hidden">
                    <motion.img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      variants={isMobile ? mobileImageVariants : imageSwapVariants}
                      initial={isMobile ? "offscreen" : "initial"}
                      whileInView={isMobile ? "onscreen" : undefined}
                      viewport={isMobile ? { once: true, amount: 0.3 } : undefined}
                      whileHover={{
                        scale: isMobile ? 1.1 : 1.15,
                        rotate: isMobile ? 2 : 2,
                        filter: isMobile ? "brightness(1.15) saturate(1.1)" : "brightness(1.05)",
                        transition: { duration: isMobile ? 0.4 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                      onClick={() => handleImageClick(image)}
                    />
                    
                    {/* Mobile-specific shimmer effect */}
                    {isMobile && (
                      <motion.div
                        variants={mobileShimmerVariants}
                        animate="animate"
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                      />
                    )}
                    
                    {/* Shimmer effect overlay - Desktop only */}
                    {!isMobile && (
                      <motion.div
                        variants={shimmerVariants}
                        animate="animate"
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                      />
                    )}
                    
                    {/* Enhanced Gradient Overlay */}
                    <motion.div 
                      variants={isMobile ? mobileOverlayVariants : undefined}
                      initial={isMobile ? "offscreen" : { opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      whileInView={isMobile ? "onscreen" : undefined}
                      viewport={isMobile ? { once: true, amount: 0.6 } : undefined}
                      transition={{ duration: isMobile ? 0.8 : 0.5 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"
                    >
                      <motion.div
                        variants={isMobile ? mobileParallaxVariants : undefined}
                        custom={index}
                        initial={isMobile ? "offscreen" : { y: 50, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        whileInView={isMobile ? "onscreen" : undefined}
                        viewport={isMobile ? { once: true, amount: 0.7 } : undefined}
                        transition={{ delay: isMobile ? 0.4 : 0.1, duration: isMobile ? 0.8 : 0.5 }}
                        className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                      >
                        <h3 className="text-white font-bold text-lg md:text-xl mb-2 line-clamp-2">
                          {language === 'en' ? image.title : image.titleAm}
                        </h3>
                        <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4">
                          {language === 'en' ? image.description : image.descriptionAm}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9, rotate: -5 }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            onClick={() => handleImageClick(image)}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9, rotate: 5 }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        {/* Mobile-specific floating elements */}
                        {isMobile && (
                          <>
                            <motion.div
                              variants={mobilePulseVariants}
                              animate="animate"
                              className="absolute top-3 right-3 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                            />
                            <motion.div
                              variants={sparkleVariants}
                              animate="animate"
                              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100"
                            >
                              <Star className="w-4 h-4 text-white drop-shadow-lg" />
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                    
                    {/* Corner accents - Desktop only */}
                    {!isMobile && (
                      <>
                        <motion.div
                          variants={sparkleVariants}
                          animate="animate"
                          className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                        />
                        <motion.div
                          variants={floatingVariants}
                          animate="animate"
                          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100"
                        >
                          <Star className="w-4 h-4 text-white drop-shadow-lg" />
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20"
        >
          {[
            { number: '500+', label: language === 'en' ? 'Moves Completed' : 'የተጠናቀቁ መጓጓዣዎች' },
            { number: '98%', label: language === 'en' ? 'Customer Satisfaction' : 'የደንበኛ እርካታ' },
            { number: '24/7', label: language === 'en' ? 'Support Available' : 'ድጋፍ ይገኛል' },
            { number: '5★', label: language === 'en' ? 'Average Rating' : 'አማካኝ ደረጃ' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3, type: "spring", stiffness: 200 }
              }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Zap className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
              
              {/* Floating sparkles - Desktop only */}
              {!isMobile && (
                <motion.div
                  variants={sparkleVariants}
                  animate="animate"
                  className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateX: -20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, rotateX: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative max-w-7xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Navigation Buttons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 relative"
                >
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 p-6 lg:p-8 bg-white"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? selectedImage.title : selectedImage.titleAm}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {language === 'en' ? selectedImage.description : selectedImage.descriptionAm}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button onClick={handleShare} className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      {language === 'en' ? 'Share' : 'አጋራ'}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {language === 'en' ? 'Download' : 'አውርድ'}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
} 