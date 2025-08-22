export interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  titleAm: string
  category: string
  categoryAm: string
  description: string
  descriptionAm: string
  height: 'short' | 'medium' | 'tall'
}

// Function to shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get all gallery images from both folders
export function getAllGalleryImages(): GalleryImage[] {
  // Images from /images/gallary/ folder
  const gallaryImages = [
    'qua1.png', 'qua2.png', 'qua3.png', 'qua4.png', 'qua5.png',
    'qua6.jpeg', 'qua7.jpeg', 'qua8.jpeg', 'qua9.jpeg', 'qua10.jpeg',
    'qua11.jpeg', 'qua12.jpeg', 'qua13.jpeg', 'qua14.jpeg', 'qua15.jpeg',
    'qua16.jpeg', 'qua17.jpeg', 'qua18.jpeg'
  ]

  // Images from /images/gallery/ folder
  const galleryImages = [
    '1753769853063-xphwlpgvg6m.jpg'
  ]

  const allImages: GalleryImage[] = []

  // Process gallary images
  gallaryImages.forEach((filename, index) => {
    const id = `gallary-${index + 1}`
    const category = getImageCategory(filename, index)
    const height = getImageHeight(index)
    
    allImages.push({
      id,
      src: `/images/gallary/${filename}`,
      alt: `Professional moving and packing service - ${filename}`,
      title: getImageTitle(filename, category),
      titleAm: getImageTitleAm(filename, category),
      category: category.en,
      categoryAm: category.am,
      description: getImageDescription(category),
      descriptionAm: getImageDescriptionAm(category),
      height
    })
  })

  // Process gallery images
  galleryImages.forEach((filename, index) => {
    const id = `gallery-${index + 1}`
    const category = getImageCategory(filename, index)
    const height = getImageHeight(index)
    
    allImages.push({
      id,
      src: `/images/gallery/${filename}`,
      alt: `Professional moving and packing service - ${filename}`,
      title: getImageTitle(filename, category),
      titleAm: getImageTitleAm(filename, category),
      category: category.en,
      categoryAm: category.am,
      description: getImageDescription(category),
      descriptionAm: getImageDescriptionAm(category),
      height
    })
  })

  return allImages
}

// Get randomized gallery images
export function getRandomizedGalleryImages(): GalleryImage[] {
  const allImages = getAllGalleryImages()
  return shuffleArray(allImages)
}

// Helper function to determine category based on filename or index
function getImageCategory(filename: string, index: number) {
  // Distribute images across different categories
  const categories = [
    { en: 'Moving Services', am: 'የመጓጓዣ አገልግሎቶች' },
    { en: 'Commercial', am: 'ንግድ' },
    { en: 'Packaging', am: 'መጠን' },
    { en: 'Storage', am: 'የማከማቻ' },
    { en: 'Team', am: 'ቡድን' }
  ]
  
  return categories[index % categories.length]
}

// Helper function to determine image height for masonry layout
function getImageHeight(index: number): 'short' | 'medium' | 'tall' {
  const heights: ('short' | 'medium' | 'tall')[] = ['medium', 'tall', 'short', 'medium', 'tall']
  return heights[index % heights.length]
}

// Helper function to generate title based on category
function getImageTitle(filename: string, category: { en: string; am: string }): string {
  const titles = {
    'Moving Services': 'Residential Moving',
    'Commercial': 'Office Relocation',
    'Packaging': 'Packaging Services',
    'Storage': 'Storage Solutions',
    'Team': 'Professional Team'
  }
  return titles[category.en as keyof typeof titles] || 'Moving Service'
}

// Helper function to generate Amharic title
function getImageTitleAm(filename: string, category: { en: string; am: string }): string {
  const titles = {
    'Moving Services': 'የመኖሪያ ቤት መጓጓዣ',
    'Commercial': 'የቢሮ መጓጓዣ',
    'Packaging': 'የመጠን አገልግሎቶች',
    'Storage': 'የማከማቻ መፍትሄዎች',
    'Team': 'የሙያ ቡድን'
  }
  return titles[category.en as keyof typeof titles] || 'የመጓጓዣ አገልግሎት'
}

// Helper function to generate description based on category
function getImageDescription(category: { en: string; am: string }): string {
  const descriptions = {
    'Moving Services': 'Professional residential moving services with care and precision',
    'Commercial': 'Complete office relocation services for businesses',
    'Packaging': 'Expert packaging and crating for fragile items',
    'Storage': 'Secure climate-controlled storage facilities',
    'Team': 'Experienced and dedicated moving professionals'
  }
  return descriptions[category.en as keyof typeof descriptions] || 'Professional moving and packing services'
}

// Helper function to generate Amharic description
function getImageDescriptionAm(category: { en: string; am: string }): string {
  const descriptions = {
    'Moving Services': 'የሙያ የመኖሪያ ቤት መጓጓዣ አገልግሎቶች በጥንቃቄ እና በትክክለኛነት',
    'Commercial': 'ለንግድ ድርጅቶች ሁለገብ የቢሮ መጓጓዣ አገልግሎቶች',
    'Packaging': 'ለተሳሳተ እቃዎች የሙያ መጠን እና የመጠን አገልግሎቶች',
    'Storage': 'ደህንነቱ የተጠበቀ የአየር ሁኔታ የተቆጣጠረ መጠን ተቋማት',
    'Team': 'የተሞክሩ እና ተሳላሰው የመጓጓዣ ሙያተኞች'
  }
  return descriptions[category.en as keyof typeof descriptions] || 'የሙያ መጓጓዣ እና መጠን አገልግሎቶች'
}
