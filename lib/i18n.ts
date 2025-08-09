export type Language = 'en' | 'am'

export interface Translations {
  // Header
  nav: {
    home: string
    about: string
    services: string
    blog: string
    contact: string
  }
  header: {
    contact: string
    bookNow: string
  }

  // Hero Section
  hero: {
    badge: string
    title: string
    subtitle: string
    description: string
    bookMove: string
    viewServices: string
    trustIndicators: {
      licensed: string
      sameDay: string
      rated: string
    }
    mainVisual: {
      title: string
      subtitle: string
    }
    stats: {
      customers: string
      rating: string
    }
  }

  // Services Section
  services: {
    badge: string
    title: string
    subtitle: string
    learnMore: string
    bottomCTA: {
      title: string
      subtitle: string
      learnMore: string
      bookNow: string
    }
    trustIndicators: {
      licensed: string
      support: string
      quotes: string
    }
  }

  // Testimonials Section
  testimonials: {
    badge: string
    title: string
    subtitle: string
    cta: string
    stats: {
      customers: string
      moves: string
      rating: string
      support: string
    }
  }

  // Contact Page
  contact: {
    badge: string
    title: string
    subtitle: string
    form: {
      title: string
      description: string
      name: string
      email: string
      phone: string
      subject: string
      message: string
      sendMessage: string
      sending: string
      success: string
      error: string
    }
    methods: {
      title: string
      phone: string
      whatsapp: string
      telegram: string
      address: string
    }
    hours: {
      title: string
      weekdays: string
      saturday: string
      sunday: string
      closed: string
    }
    emergency: {
      title: string
      description: string
      callNow: string
    }
  }

  // Footer
  footer: {
    findUs: string
    location: string
    quickLinks: string
    ourServices: string
    contactInfo: string
    followUs: string
    businessHours: string
    legal: {
      privacy: string
      terms: string
    }
  }

  // Floating Buttons
  floatingButtons: {
    callNow: string
    whatsapp: string
    telegram: string
    quickContact: string
  }

  // TikTok Section
  tiktok: {
    badge: string
    title: string
    subtitle: string
    username: string
    tagline: string
    watchVideo: string
    videoDescription: string
    viewOnTiktok: string
    share: string
    embedTitle: string
    embedDescription: string
    embedExample: string
    socialStats: {
      likes: string
      comments: string
      shares: string
    }
  }

  // CTA Section
  cta: {
    badge: string
    title: string
    subtitle: string
    getFreeQuote: string
    callNow: string
    whyChooseUs: string
    benefits: {
      licensed: string
      sameDay: string
      rated: string
      freeEstimates: string
      professional: string
      fullyLicensed: string
      competitive: string
      support: string
    }
    stats: {
      customers: string
      rating: string
    }
    bottomText: string
  }

  // Common
  common: {
    loading: string
    error: string
    notFound: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
      nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    blog: 'Blog',
    contact: 'Contact',
  },
    header: {
      contact: 'Contact',
      bookNow: 'Book Now',
    },
    hero: {
      badge: 'Serving Addis Ababa & Surrounding Areas',
      title: 'Professional Moving Services',
      subtitle: 'in Addis Ababa',
      description: 'Experience stress-free moving with our professional team. We handle everything from packing to delivery with care and efficiency.',
      bookMove: 'Book Your Move',
      viewServices: 'View Services',
      trustIndicators: {
        licensed: 'Licensed & Insured',
        sameDay: 'Same Day Service',
        rated: '5-Star Rated',
      },
      mainVisual: {
        title: 'Professional Moving',
        subtitle: 'Your trusted partner in relocation',
      },
      stats: {
        customers: 'Happy Customers',
        rating: 'Rating',
      },
    },
    services: {
      badge: 'Our Services',
      title: 'Professional Moving Solutions',
      subtitle: 'From local moves to international relocations, we provide comprehensive moving services tailored to your needs.',
      learnMore: 'Learn More',
      bottomCTA: {
        title: 'Ready to Start Your Move?',
        subtitle: 'Get a free quote and let us handle your relocation with care and professionalism.',
        learnMore: 'Learn More',
        bookNow: 'Book Now',
      },
      trustIndicators: {
        licensed: 'Licensed & Insured',
        support: '24/7 Support',
        quotes: 'Free Quotes',
      },
    },
    testimonials: {
      badge: 'Customer Reviews',
      title: 'What Our Customers Say',
      subtitle: "Don't just take our word for it. Here's what our satisfied customers have to say about their moving experience.",
      cta: 'Start Your Move Today',
      stats: {
        customers: 'Happy Customers',
        moves: 'Successful Moves',
        rating: 'Average Rating',
        support: 'Support Available',
      },
    },
    contact: {
      badge: 'Get in Touch',
      title: 'Contact Us',
      subtitle: 'We would love to hear from you. Whether you have a question or just want to say hello, we are here to help.',
      form: {
        title: 'Send Us a Message',
        description: 'Fill out the form below to send us a message and we will get back to you as soon as possible.',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        sendMessage: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again later.',
      },
      methods: {
        title: 'Contact Methods',
        phone: 'Phone: +251 911 123 456',
        whatsapp: 'WhatsApp: +251 911 123 456',
        telegram: 'Telegram: @activemovers',
        address: 'Address: Addis Ababa, Ethiopia',
      },
      hours: {
        title: 'Business Hours',
        weekdays: 'Mon-Fri: 8AM-6PM',
        saturday: 'Sat: 9AM-5PM',
        sunday: 'Sun: Closed',
        closed: 'Closed',
      },
      emergency: {
        title: 'Emergency Service',
        description: 'For urgent assistance, please call our emergency line.',
        callNow: 'Call Now: +251 911 123 456',
      },
    },
    footer: {
      findUs: 'Find Us',
      location: 'Visit our location in Addis Ababa, Ethiopia',
      quickLinks: 'Quick Links',
      ourServices: 'Our Services',
      contactInfo: 'Contact Info',
      followUs: 'Follow Us',
      businessHours: 'Mon-Fri: 8AM-6PM',
      legal: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
    },
    floatingButtons: {
      callNow: 'Call Now',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      quickContact: 'Quick Contact',
    },
    tiktok: {
      badge: 'Social Media',
      title: 'See Us in Action',
      subtitle: 'Watch our team at work and see why customers choose Active Movers & Packers for their moving needs.',
      username: '@activemovers',
      tagline: 'Professional Moving Services',
      watchVideo: 'Watch Our Latest Video',
      videoDescription: 'See our team in action during a recent move',
      viewOnTiktok: 'View on TikTok',
      share: 'Share',
      embedTitle: 'Want to embed your TikTok video?',
      embedDescription: 'Replace the placeholder above with your actual TikTok embed code',
      embedExample: 'Example TikTok Embed Code:',
      socialStats: {
        likes: 'Likes',
        comments: 'Comments',
        shares: 'Shares',
      },
    },
    cta: {
      badge: 'Get Started Today',
      title: 'Ready to Move?',
      subtitle: 'Get your free quote today and experience stress-free moving with our professional team.',
      getFreeQuote: 'Get Free Quote',
      callNow: 'Call Now',
      whyChooseUs: 'Why Choose Us?',
      benefits: {
        licensed: 'Licensed & Insured',
        sameDay: 'Same Day Service',
        rated: '5-Star Rated',
        freeEstimates: 'Free Estimates',
        professional: 'Professional & Experienced Team',
        fullyLicensed: 'Fully Licensed & Insured',
        competitive: 'Competitive Pricing',
        support: '24/7 Customer Support',
      },
      stats: {
        customers: 'Happy Customers',
        rating: 'Average Rating',
      },
      bottomText: 'Available 7 days a week • Free estimates • Licensed & insured • Same-day service available',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      notFound: 'Page not found',
    },
  },
  am: {
    nav: {
      home: 'ዋና ገጽ',
      about: 'ስለ እኛ',
      services: 'አገልግሎቶች',
      blog: 'ዜናዎች',
      contact: 'አድራሻ',
    },
    header: {
      contact: 'አድራሻ',
      bookNow: 'አሁን ያስያዙ',
    },
    hero: {
      badge: 'አዲስ አበባ እና አካባቢዎችን እንደምንሰጥ',
      title: 'የሙያ የመጓጓዣ አገልግሎቶች',
      subtitle: 'በአዲስ አበባ',
      description: 'ከሙያ ቡድናችን ጋር ያለ ግፍ የመጓጓዣ ስራ ያድርጉ። ከመጠን እስከ አድራሻ ሁሉንም ነገር በጥንቃቄ እና በውጤታማነት እንደምንሰጥ።',
      bookMove: 'መጓጓዣዎን ያስያዙ',
      viewServices: 'አገልግሎቶችን ይመልከቱ',
      trustIndicators: {
        licensed: 'የተፈቀደ እና የተጣራ',
        sameDay: 'የተመሳሰለ ቀን አገልግሎት',
        rated: '5-ኮከብ ደረጃ',
      },
      mainVisual: {
        title: 'የሙያ መጓጓዣ',
        subtitle: 'የመጓጓዣ አጋርዎ',
      },
      stats: {
        customers: 'ደስ ያለው ደንበኛ',
        rating: 'ደረጃ',
      },
    },
    services: {
      badge: 'አገልግሎቶቻችን',
      title: 'የሙያ የመጓጓዣ መፍትሄዎች',
      subtitle: 'ከአካባቢያዊ እስከ ዓለም አቀፍ መጓጓዣዎች፣ ሁለገብ የመጓጓዣ አገልግሎቶችን እንደምንሰጥ።',
      learnMore: 'ተጨማሪ ይወቁ',
      bottomCTA: {
        title: 'መጓጓዣዎን ለመጀመር ዝግጁ ነዎት?',
        subtitle: 'ነፃ ዋጋ ያግኙ እና መጓጓዣዎን በጥንቃቄ እና በሙያ እንደምንሰጥ።',
        learnMore: 'ተጨማሪ ይወቁ',
        bookNow: 'አሁን ያስያዙ',
      },
      trustIndicators: {
        licensed: 'የተፈቀደ እና የተጣራ',
        support: '24/7 ድጋፍ',
        quotes: 'ነፃ ዋጋዎች',
      },
    },
    testimonials: {
      badge: 'የደንበኛ ግምገማዎች',
      title: 'ደንበኞቻችን ምን ይላሉ',
      subtitle: 'ቃላችንን ብቻ አይያዙ። ደስ ያለው ደንበኞቻችን ስለ የመጓጓዣ ስራቸው ምን እንደሚሉ ይመልከቱ።',
      cta: 'መጓጓዣዎን ዛሬ ያስጀምሩ',
      stats: {
        customers: 'ደስ ያለው ደንበኛ',
        moves: 'የተሳካከለ መጓጓዣ',
        rating: 'አማካይ ደረጃ',
        support: 'ድጋፍ ይገኛል',
      },
    },
    contact: {
      badge: 'አስተያየቶች እንደምንሰጥ',
      title: 'አስተያየቶች እንደምንሰጥ',
      subtitle: 'እኛን እንደምንመርጥ እና እንደምንመልከቱ እንደምንሰጥ።',
      form: {
        title: 'እኛን እንደምንመልከቱ',
        description: 'እኛን እንደምንመልከቱ እና እንደምንመልከቱ እንደምንሰጥ።',
        name: 'ስም',
        email: 'ኢሜል',
        phone: 'ስልክ',
        subject: 'ስም',
        message: 'መልእክት',
        sendMessage: 'እንደምንመልከቱ',
        sending: 'እንደምንመልከቱ ላይ...',
        success: 'እንደምንመልከቱ ተሳካሚ።',
        error: 'እንደምንመልከቱ ተከስቷል። እንደምንመልከቱ እንደምንሰጥ።',
      },
      methods: {
        title: 'አስተያየቶች እንደምንሰጥ',
        phone: 'ስልክ: +251 911 123 456',
        whatsapp: 'ዋትስአፕ: +251 911 123 456',
        telegram: 'ቴሌግራም: @activemovers',
        address: 'አድራሻ: አዲስ አበባ፣ ኢትዮጵያ ውስጥ ያለውን አካባቢችን ይጎብኙ',
      },
      hours: {
        title: 'መረጃ እንደምንሰጥ',
        weekdays: 'ሰኞ-ዓርብ: 8AM-6PM',
        saturday: 'ሰኞ: 9AM-5PM',
        sunday: 'ዓርብ: ዝግጁ',
        closed: 'ዝግጁ',
      },
      emergency: {
        title: 'የመጓጓዣ ስራ',
        description: 'የመጓጓዣ ስራ ለመጀመር ዝግጁ ነዎት።',
        callNow: 'አሁን ይደውሉ: +251 911 123 456',
      },
    },
    footer: {
      findUs: 'ያግኙን',
      location: 'አዲስ አበባ፣ ኢትዮጵያ ውስጥ ያለውን አካባቢችን ይጎብኙ',
      quickLinks: 'ፈጣን አገናኞች',
      ourServices: 'አገልግሎቶቻችን',
      contactInfo: 'የመገናኛ መረጃ',
      followUs: 'ይከተሉን',
      businessHours: 'ሰኞ-ዓርብ: 8AM-6PM',
      legal: {
        privacy: 'የግል መረጃ ፖሊሲ',
        terms: 'የአገልግሎት ውል',
      },
    },
    floatingButtons: {
      callNow: 'አሁን ይደውሉ',
      whatsapp: 'ዋትስአፕ',
      telegram: 'ቴሌግራም',
      quickContact: 'ፈጣን መገናኛ',
    },
    tiktok: {
      badge: 'ማህበራዊ ሚዲያ',
      title: 'በስራ ላይ ይመልከቱን',
      subtitle: 'ቡድናችንን በስራ ላይ ይመልከቱ እና ደንበኞች ለመጓጓዣ ፍላጎታቸው አክቲቭ ሞቨርስ እና ፓከርስ ለምን እንደሚመርጡ ይመልከቱ።',
      username: '@activemovers',
      tagline: 'የሙያ መጓጓዣ አገልግሎቶች',
      watchVideo: 'የቅርቡን ቪዲዮ ይመልከቱ',
      videoDescription: 'ቡድናችንን በቅርቡ በመጓጓዣ ላይ በስራ ላይ ይመልከቱ',
      viewOnTiktok: 'በቲክቶክ ላይ ይመልከቱ',
      share: 'ያጋራ',
      embedTitle: 'ቲክቶክ ቪዲዮዎን ማስገባት ይፈልጋሉ?',
      embedDescription: 'ከላይ ያለውን ምሳሌ በእውነተኛ የቲክቶክ አስገባ ኮድ ይተኩ',
      embedExample: 'የቲክቶክ አስገባ ኮድ ምሳሌ:',
      socialStats: {
        likes: 'የወደዱ',
        comments: 'አስተያየቶች',
        shares: 'ያጋሩ',
      },
    },
    cta: {
      badge: 'ዛሬ ይጀምሩ',
      title: 'መጓጓዣ ለመጀመር ዝግጁ ነዎት?',
      subtitle: 'ዛሬ ነፃ ዋጋ ያግኙ እና ከሙያ ቡድናችን ጋር ያለ ግፍ የመጓጓዣ ስራ ያድርጉ።',
      getFreeQuote: 'ነፃ ዋጋ ያግኙ',
      callNow: 'አሁን ይደውሉ',
      whyChooseUs: 'ለምን እንደምንመርጥ?',
      benefits: {
        licensed: 'የተፈቀደ እና የተጣራ',
        sameDay: 'የተመሳሰለ ቀን አገልግሎት',
        rated: '5-ኮከብ ደረጃ',
        freeEstimates: 'ነፃ ዋጋዎች',
        professional: 'የሙያ እና የተሞክሮ ቡድን',
        fullyLicensed: 'ሙሉ በሙሉ የተፈቀደ እና የተጣራ',
        competitive: 'ውድድር ያለው ዋጋ',
        support: '24/7 የደንበኛ ድጋፍ',
      },
      stats: {
        customers: 'ደስ ያለው ደንበኛ',
        rating: 'አማካይ ደረጃ',
      },
      bottomText: 'በሳምንት 7 ቀን ይገኛል • ነፃ ዋጋዎች • የተፈቀደ እና የተጣራ • የተመሳሰለ ቀን አገልግሎት ይገኛል',
    },
    common: {
      loading: 'በመጫን ላይ...',
      error: 'ስህተት ተከስቷል',
      notFound: 'ገጹ አልተገኘም',
    },
  },
}

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to English if translation not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if translation not found
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
} 
 
 
 