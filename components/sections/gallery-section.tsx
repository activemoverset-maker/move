"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Share2, Filter, Eye, Heart } from 'lucide-react'
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

export function GallerySection() {
  const { t, language } = useLanguage()
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load and randomize images on component mount
  useEffect(() => {
    const randomizedImages = getRandomizedGalleryImages()
    setGalleryImages(randomizedImages)
    setFilteredImages(randomizedImages)
  }, [])

  useEffect(() => {
    if (galleryImages.length === 0) return
    
    setIsLoading(true)
    const timer = setTimeout(() => {
      if (activeCategory === 'all') {
        setFilteredImages(galleryImages)
      } else {
        setFilteredImages(galleryImages.filter(img => img.category === activeCategory))
      }
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeCategory, galleryImages])

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
    trackEvent({ 
      action: 'gallery_image_click', 
      category: 'Gallery', 
      label: image.title 
    })
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      prevImage()
    }
  }

  const downloadImage = (image: GalleryImage) => {
    const link = document.createElement('a')
    link.href = image.src
    link.download = `${image.title.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    trackEvent({ 
      action: 'gallery_image_download', 
      category: 'Gallery', 
      label: image.title 
    })
  }

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this amazing moving service: ${image.title}`,
          url: window.location.href
        })
        trackEvent({ 
          action: 'gallery_image_share', 
          category: 'Gallery', 
          label: image.title 
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      trackEvent({ 
        action: 'gallery_image_copy_link', 
        category: 'Gallery', 
        label: image.title 
      })
    }
  }

  const getHeightClass = (height: string) => {
    switch (height) {
      case 'tall': return 'row-span-2'
      case 'medium': return 'row-span-1'
      case 'short': return 'row-span-1'
      default: return 'row-span-1'
    }
  }

  return (
    <section className="section-padding bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      
      <div className="container-max relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              {language === 'en' ? 'Our Gallery' : 'የእኛ ጋለሪ'}
            </Badge>
            <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent mb-8">
            {language === 'en' ? 'Our Work in Action' : 'የእኛ ስራ በተግባር'}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Explore our professional moving services through our stunning photo gallery. See our dedicated team in action, delivering exceptional service with care and precision.'
              : 'የእኛን የሙያ መጓጓዣ አገልግሎቶች በአስደናቂ ፎቶ ጋለሪያችን ውስጥ ያስሱ። ተሳላሰ ቡድናችንን በተግባር ይመልከቱ፣ ልዩ አገልግሎት በጥንቃቄ እና በትክክለኛነት እያቀረቡ።'
            }
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-primary border border-gray-200 hover:border-primary/30'
              }`}
            >
              {language === 'en' ? category.label : category.labelAm}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Masonry Gallery Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20 auto-rows-[300px]"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.7, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  className={`group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white ${getHeightClass(image.height)}`}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      loading="lazy"
                    />
                    
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                          className="space-y-4"
                        >
                          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                            {language === 'en' ? image.category : image.categoryAm}
                          </Badge>
                          <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                            {language === 'en' ? image.title : image.titleAm}
                          </h3>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {language === 'en' ? image.description : image.descriptionAm}
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="flex gap-2"
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                          onClick={() => openLightbox(image, index)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '500+', label: language === 'en' ? 'Successful Moves' : 'የተሳካኩ መጓጓዣዎች', icon: '🚚', color: 'from-blue-500 to-blue-600' },
            { number: '50+', label: language === 'en' ? 'Happy Clients' : 'ደስ የሚሉ ደንበኞች', icon: '😊', color: 'from-green-500 to-green-600' },
            { number: '24/7', label: language === 'en' ? 'Support Available' : 'ድጋፍ ይገኛል', icon: '🛟', color: 'from-purple-500 to-purple-600' },
            { number: '100%', label: language === 'en' ? 'Satisfaction Rate' : 'የደስታ መጠን', color: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
              className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/30 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <div className="text-center">
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.icon ? '' : 'text-4xl'}`}>
                  {stat.icon || '⭐'}
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-w-7xl w-full max-h-[90vh]"
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-16 right-0 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full hover:scale-110 transition-all duration-300"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full hover:scale-110 transition-all duration-300"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full hover:scale-110 transition-all duration-300"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              {/* Image Container */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full max-h-[80vh] object-contain"
                />
                
                {/* Enhanced Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-white gap-6">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        {language === 'en' ? selectedImage.category : selectedImage.categoryAm}
                      </Badge>
                      <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                        {language === 'en' ? selectedImage.title : selectedImage.titleAm}
                      </h3>
                      <p className="text-white/90 text-base md:text-lg leading-relaxed mb-2">
                        {language === 'en' ? selectedImage.description : selectedImage.descriptionAm}
                      </p>
                      <p className="text-white/70 text-sm">
                        {currentIndex + 1} / {filteredImages.length} • {language === 'en' ? 'Professional Moving Services' : 'የሙያ መጓጓዣ አገልግሎቶች'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300"
                        onClick={() => downloadImage(selectedImage)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Download' : 'ያውርዱ'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300"
                        onClick={() => shareImage(selectedImage)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Share' : 'ያጋሩ'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Keyboard Navigation Hint */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                {language === 'en' ? 'Use arrow keys to navigate • ESC to close' : 'የቀስት ቁልፎችን ለመራመድ ይጠቀሙ • ለመደምደም ESC'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
} 