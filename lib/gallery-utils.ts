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
      title: getImageTitle(filename, category, index),
      titleAm: getImageTitleAm(filename, category, index),
      category: category.en,
      categoryAm: category.am,
      description: getImageDescription(category, index),
      descriptionAm: getImageDescriptionAm(category, index),
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
      title: getImageTitle(filename, category, index),
      titleAm: getImageTitleAm(filename, category, index),
      category: category.en,
      categoryAm: category.am,
      description: getImageDescription(category, index),
      descriptionAm: getImageDescriptionAm(category, index),
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

// Helper function to generate title based on category and index for variety
function getImageTitle(filename: string, category: { en: string; am: string }, index: number): string {
  const movingTitles = [
    'Residential Moving Service',
    'Home Relocation',
    'Apartment Moving',
    'House Moving',
    'Family Moving',
    'Residential Relocation'
  ]
  
  const commercialTitles = [
    'Office Relocation',
    'Business Moving',
    'Commercial Relocation',
    'Corporate Moving',
    'Office Transfer',
    'Business Relocation'
  ]
  
  const packagingTitles = [
    'Professional Packaging',
    'Fragile Item Packing',
    'Custom Crating',
    'Secure Packaging',
    'Expert Packing',
    'Specialty Packaging'
  ]
  
  const storageTitles = [
    'Climate-Controlled Storage',
    'Secure Storage Facility',
    'Temporary Storage',
    'Long-term Storage',
    'Warehouse Storage',
    'Storage Solutions'
  ]
  
  const teamTitles = [
    'Professional Moving Team',
    'Experienced Crew',
    'Dedicated Staff',
    'Skilled Professionals',
    'Moving Experts',
    'Professional Crew'
  ]
  
  const titleMap = {
    'Moving Services': movingTitles,
    'Commercial': commercialTitles,
    'Packaging': packagingTitles,
    'Storage': storageTitles,
    'Team': teamTitles
  }
  
  const titles = titleMap[category.en as keyof typeof titleMap] || movingTitles
  return titles[index % titles.length]
}

// Helper function to generate Amharic title with variety
function getImageTitleAm(filename: string, category: { en: string; am: string }, index: number): string {
  const movingTitles = [
    'የመኖሪያ ቤት መጓጓዣ አገልግሎት',
    'የቤት መጓጓዣ',
    'የመጠጥ ቤት መጓጓዣ',
    'የቤት መጓጓዣ',
    'የቤተሰብ መጓጓዣ',
    'የመኖሪያ ቤት መጓጓዣ'
  ]
  
  const commercialTitles = [
    'የቢሮ መጓጓዣ',
    'የንግድ መጓጓዣ',
    'የንግድ መጓጓዣ',
    'የድርጅት መጓጓዣ',
    'የቢሮ ማዛወሪያ',
    'የንግድ መጓጓዣ'
  ]
  
  const packagingTitles = [
    'የሙያ መጠን',
    'የተሳሳተ እቃዎች መጠን',
    'የተለያዩ መጠን',
    'ደህንነቱ የተጠበቀ መጠን',
    'የሙያ መጠን',
    'የስፔሻሊቲ መጠን'
  ]
  
  const storageTitles = [
    'የአየር ሁኔታ የተቆጣጠረ መጠን',
    'ደህንነቱ የተጠበቀ መጠን ተቋም',
    'የጊዜያዊ መጠን',
    'የረጅም ጊዜ መጠን',
    'የመጋዘን መጠን',
    'የመጠን መፍትሄዎች'
  ]
  
  const teamTitles = [
    'የሙያ የመጓጓዣ ቡድን',
    'የተሞክሩ ቡድን',
    'ተሳላሰው ሰጪዎች',
    'የተሰለጠኑ ሙያተኞች',
    'የመጓጓዣ ስፔሻሊስቶች',
    'የሙያ ቡድን'
  ]
  
  const titleMap = {
    'Moving Services': movingTitles,
    'Commercial': commercialTitles,
    'Packaging': packagingTitles,
    'Storage': storageTitles,
    'Team': teamTitles
  }
  
  const titles = titleMap[category.en as keyof typeof titleMap] || movingTitles
  return titles[index % titles.length]
}

// Helper function to generate description based on category and index for variety
function getImageDescription(category: { en: string; am: string }, index: number): string {
  const movingDescriptions = [
    'Professional residential moving services with care and precision',
    'Complete home relocation with experienced movers',
    'Safe and efficient apartment moving services',
    'Reliable house moving with attention to detail',
    'Family-focused moving with extra care',
    'Comprehensive residential relocation services'
  ]
  
  const commercialDescriptions = [
    'Complete office relocation services for businesses',
    'Professional business moving with minimal downtime',
    'Efficient commercial relocation solutions',
    'Corporate moving with specialized equipment',
    'Seamless office transfer services',
    'Business relocation with project management'
  ]
  
  const packagingDescriptions = [
    'Expert packaging and crating for fragile items',
    'Professional packing services for all items',
    'Custom crating solutions for valuable items',
    'Secure packaging with protective materials',
    'Specialized packing for delicate objects',
    'Comprehensive packaging and protection'
  ]
  
  const storageDescriptions = [
    'Secure climate-controlled storage facilities',
    'Professional storage solutions for all needs',
    'Temporary and long-term storage options',
    'Safe and accessible storage facilities',
    'Warehouse storage with 24/7 security',
    'Flexible storage solutions for businesses'
  ]
  
  const teamDescriptions = [
    'Experienced and dedicated moving professionals',
    'Skilled team with years of moving experience',
    'Professional crew committed to excellence',
    'Expert movers with specialized training',
    'Dedicated staff ensuring smooth moves',
    'Professional team delivering quality service'
  ]
  
  const descriptionMap = {
    'Moving Services': movingDescriptions,
    'Commercial': commercialDescriptions,
    'Packaging': packagingDescriptions,
    'Storage': storageDescriptions,
    'Team': teamDescriptions
  }
  
  const descriptions = descriptionMap[category.en as keyof typeof descriptionMap] || movingDescriptions
  return descriptions[index % descriptions.length]
}

// Helper function to generate Amharic description with variety
function getImageDescriptionAm(category: { en: string; am: string }, index: number): string {
  const movingDescriptions = [
    'የሙያ የመኖሪያ ቤት መጓጓዣ አገልግሎቶች በጥንቃቄ እና በትክክለኛነት',
    'የተሞክሩ አንድነቶች ያሉት ሁለገብ የቤት መጓጓዣ',
    'ደህንነቱ የተጠበቀ እና ውጤታማ የመጠጥ ቤት መጓጓዣ አገልግሎቶች',
    'የትኩረት ያለው የቤት መጓጓዣ በተሳላሰነት',
    'የቤተሰብ ያተኩረ መጓጓዣ በተጨማሪ ጥንቃቄ',
    'ሁለገብ የመኖሪያ ቤት መጓጓዣ አገልግሎቶች'
  ]
  
  const commercialDescriptions = [
    'ለንግድ ድርጅቶች ሁለገብ የቢሮ መጓጓዣ አገልግሎቶች',
    'የተሻሻለ የንግድ መጓጓዣ በዝቅተኛ የጊዜ ኪሳራ',
    'ውጤታማ የንግድ መጓጓዣ መፍትሄዎች',
    'የድርጅት መጓጓዣ በስፔሻላይዝድ መሣሪያዎች',
    'ያለ ችግር የቢሮ ማዛወሪያ አገልግሎቶች',
    'የንግድ መጓጓዣ በፕሮጀክት አስተዳደር'
  ]
  
  const packagingDescriptions = [
    'ለተሳሳተ እቃዎች የሙያ መጠን እና የመጠን አገልግሎቶች',
    'ለሁሉም እቃዎች የሙያ መጠን አገልግሎቶች',
    'ለውድ እቃዎች የተለያዩ መጠን መፍትሄዎች',
    'የመጠን እቃዎች ያሉት ደህንነቱ የተጠበቀ መጠን',
    'ለተሳሳተ እቃዎች የስፔሻላይዝድ መጠን',
    'ሁለገብ የመጠን እና ጥበቃ'
  ]
  
  const storageDescriptions = [
    'ደህንነቱ የተጠበቀ የአየር ሁኔታ የተቆጣጠረ መጠን ተቋማት',
    'ለሁሉም ፍላጎቶች የሙያ መጠን መፍትሄዎች',
    'የጊዜያዊ እና የረጅም ጊዜ መጠን አማራጮች',
    'ደህንነቱ የተጠበቀ እና የሚደርስ መጠን ተቋማት',
    'የመጋዘን መጠን በ24/7 ደህንነት',
    'ለንግድ ድርጅቶች የሚስማሙ መጠን መፍትሄዎች'
  ]
  
  const teamDescriptions = [
    'የተሞክሩ እና ተሳላሰው የመጓጓዣ ሙያተኞች',
    'የመጓጓዣ ስራ የተሞክሩ የተሰለጠኑ ቡድን',
    'የሙያ ቡድን ወደ ለካስ ተሳላሰው',
    'የስፔሻላይዝድ ስልጠና ያላቸው የሙያ አንድነቶች',
    'ያለ ችግር መጓጓዣዎችን የሚያረጋግጡ ተሳላሰው ሰጪዎች',
    'የጥራት አገልግሎት የሚሰጡ የሙያ ቡድን'
  ]
  
  const descriptionMap = {
    'Moving Services': movingDescriptions,
    'Commercial': commercialDescriptions,
    'Packaging': packagingDescriptions,
    'Storage': storageDescriptions,
    'Team': teamDescriptions
  }
  
  const descriptions = descriptionMap[category.en as keyof typeof descriptionMap] || movingDescriptions
  return descriptions[index % descriptions.length]
}
