"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'

interface ProjectImage {
  id: string
  src: string
  alt: string
  title: string
  titleAm: string
  description: string
  descriptionAm: string
  category: string
  categoryAm: string
}

const PROJECT_IMAGES: ProjectImage[] = [
  {
    id: '1',
    src: '/images/qua1.png',
    alt: 'Professional moving service with truck and team',
    title: 'Residential Moving',
    titleAm: 'የመኖሪያ ቤት መጓጓዣ',
    description: 'Complete home relocation with professional packing and careful handling',
    descriptionAm: 'የሙያ መጠን እና ደህንነቱ የተጣራ አያያዝ ያለው ሁለገብ የቤት መጓጓዣ',
    category: 'Residential',
    categoryAm: 'መኖሪያ ቤት'
  },
  {
    id: '2',
    src: '/images/qua2.png',
    alt: 'Office furniture being moved by professional team',
    title: 'Office Relocation',
    titleAm: 'የቢሮ መጓጓዣ',
    description: 'Efficient office moving with minimal business disruption',
    descriptionAm: 'የንግድ ስራ ጥፋት ሳያደርግ ውጤታማ የቢሮ መጓጓዣ',
    category: 'Commercial',
    categoryAm: 'ንግድ'
  },
  {
    id: '3',
    src: '/images/qua3.png',
    alt: 'Moving truck with professional equipment',
    title: 'Professional Equipment',
    titleAm: 'የሙያ መሣሪያዎች',
    description: 'State-of-the-art moving equipment for safe transportation',
    descriptionAm: 'ደህንነቱ የተጣራ መጓጓዣ ለማድረግ የሚያገለግል ዘመናዊ የሙያ መሣሪያዎች',
    category: 'Equipment',
    categoryAm: 'መሣሪያዎች'
  },
  {
    id: '4',
    src: '/images/qua4.png',
    alt: 'Careful handling of fragile items during move',
    title: 'Fragile Handling',
    titleAm: 'የተሻለ አያያዝ',
    description: 'Specialized care for delicate and valuable items',
    descriptionAm: 'ለተሻለ እና ውድ እቃዎች ልዩ እንክብካቤ',
    category: 'Specialized',
    categoryAm: 'ልዩ'
  },
  {
    id: '5',
    src: '/images/qua5.png',
    alt: 'Team of professional movers at work',
    title: 'Expert Team',
    titleAm: 'የሙያ ቡድን',
    description: 'Experienced professionals ensuring smooth moving process',
    descriptionAm: 'የስራ ልምድ ያላቸው ሙያተኞች ለስላሳ መጓጓዣ ሂደት ያረጋግጣሉ',
    category: 'Team',
    categoryAm: 'ቡድን'
  },
  {
    id: '6',
    src: '/images/6048392380857567568.jpg',
    alt: 'Modern moving truck with company branding',
    title: 'Modern Fleet',
    titleAm: 'ዘመናዊ ተሽከርካሪዎች',
    description: 'Well-maintained vehicles for reliable transportation',
    descriptionAm: 'የተሻለ ጥገና ያለው እና አስተማመኛ መጓጓዣ ለማድረግ የሚያገለግል ተሽከርካሪዎች',
    category: 'Fleet',
    categoryAm: 'ተሽከርካሪዎች'
  },
  {
    id: '7',
    src: '/images/6048392380857567570.jpg',
    alt: 'Professional moving service in action',
    title: 'Quality Service',
    titleAm: 'የጥራት አገልግሎት',
    description: 'Professional moving services with attention to detail',
    descriptionAm: 'ዝርዝር ትኩረት የሚሰጥ የሙያ መጓጓዣ አገልግሎት',
    category: 'Quality',
    categoryAm: 'ጥራት'
  },
  {
    id: '8',
    src: '/images/6048392380857567571.jpg',
    alt: 'Professional moving team at work',
    title: 'Expert Team',
    titleAm: 'የሙያ ቡድን',
    description: 'Skilled professionals handling your move with care',
    descriptionAm: 'የስራ ልምድ ያላቸው ሙያተኞች እንክብካቤ ያለው መጓጓዣ ያደርጋሉ',
    category: 'Professional',
    categoryAm: 'ሙያ'
  }
]

export function ImageShowcase() {
  const { language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const openModal = (image: ProjectImage) => {
    setSelectedImage(image)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isModalOpen])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            {language === 'am' ? 'የቅርብ ጊዜ ስራዎች' : 'Latest Projects'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'am' ? 'የስራ ማሳያ' : 'Visual Showcase'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'am' 
              ? 'የስራ ልምድ እና የሙያ ችሎታዎቻችንን የሚያንጸባርቁ የቅርብ ጊዜ ስራዎች' 
              : 'Explore our recent projects showcasing our expertise and professional capabilities'
            }
          </p>
        </motion.div>

        {/* Scrollable Image Gallery */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PROJECT_IMAGES.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-80 snap-start"
              >
                <motion.div
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => openModal(image)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-white/30">
                        {language === 'am' ? image.categoryAm : image.category}
                      </Badge>
                    </div>

                    {/* Hover Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {language === 'am' ? image.titleAm : image.title}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {language === 'am' ? image.descriptionAm : image.description}
                      </p>
                    </div>

                    {/* Click Indicator */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {isModalOpen && selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image */}
                <div className="relative h-96 md:h-[500px]">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {language === 'am' ? selectedImage.categoryAm : selectedImage.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {language === 'am' ? selectedImage.titleAm : selectedImage.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {language === 'am' ? selectedImage.descriptionAm : selectedImage.description}
                  </p>

                  <div className="flex gap-4">
                    <Button
                      onClick={closeModal}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      {language === 'am' ? 'ዝጋ' : 'Close'}
                    </Button>
                    <Button
                      onClick={() => {
                        // Add booking functionality here
                        window.location.href = '/booking'
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {language === 'am' ? 'ቀጠሮ ያድርጉ' : 'Book Service'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 
 