import { 
  Truck, 
  Package, 
  Building, 
  Warehouse,
  Shield,
  Clock,
  Star,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  Send
} from 'lucide-react'

export const SITE_CONFIG = {
  name: 'Movers in Addis Ababa - Active Movers & Packers',
  description: 'Professional movers in Addis Ababa, Ethiopia',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activemoverset.com',
  links: {
      phone: process.env.PHONE_NUMBER || '+251926445600',
  whatsapp: process.env.WHATSAPP_NUMBER || '+251926445600',
    telegram: process.env.TELEGRAM_USERNAME || 'activemovers',
    email: process.env.EMAIL || 'activemoverset@gmail.com',
      address: 'Beka Building, Addis Ababa, Ethiopia',
  map: 'https://www.google.com/maps/place/Beka+Building/@9.0357937,38.854252,89m/data=!3m1!1e3!4m6!3m5!1s0x164b91000256c8f5:0x57e863a61e58fa35!8m2!3d9.0357937!4d38.8544868!16s%2Fg%2F11lckzr77b?entry=ttu',
  },
  address: {
    street: 'Beka Building',
    city: 'Addis Ababa',
    country: 'Ethiopia',
  },
  businessHours: 'Mon-Fri: 8AM-6PM',
}

export const SERVICES = [
  {
    id: 'local-moving',
    title: 'Local Moving',
    titleAm: 'አካባቢያዊ መጓጓዣ',
    description: 'Professional movers in Addis Ababa, Ethiopia',
    descriptionAm: 'አዲስ አበባ እና አካባቢዎች ውስጥ የሙያ አካባቢያዊ መጓጓዣ አገልግሎቶች።',
    icon: Truck,
    features: [
      'Professional packing and unpacking',
      'Furniture disassembly and assembly',
      'Same-day delivery available',
      'Fully insured and licensed',
      'Experienced moving team',
      'Free consultation and quote'
    ],
    featuresAm: [
      'የሙያ መጠን እና መፍታት',
      'የቤት እቃዎች መሰባሰብ እና መገጣጠም',
      'የተመሳሰለ ቀን አድራሻ ይገኛል',
      'ሙሉ የተጣራ እና የተፈቀደ',
      'የተሞክሮ የመጓጓዣ ቡድን',
      'ነፃ ምክር እና ዋጋ'
    ],
    price: 'From 17,000 ETB'
  },
  {
    id: 'packaging',
    title: 'Packaging Services',
    titleAm: 'የመጠን አገልግሎቶች',
    description: 'Complete packaging solutions with high-quality materials and expert handling.',
    descriptionAm: 'ከፍተኛ ጥራት ያላቸው ቁሳቁሶች እና የሙያ አያያዝ ያላቸው ሁለገብ የመጠን መፍትሄዎች።',
    icon: Package,
    features: [
      'High-quality packing materials',
      'Fragile item protection',
      'Custom crating services',
      'Inventory management',
      'Climate-controlled storage',
      'Professional labeling'
    ],
    featuresAm: [
      'ከፍተኛ ጥራት ያላቸው የመጠን ቁሳቁሶች',
      'የተሰበሩ እቃዎች ጥበቃ',
      'የተለያዩ የመጠን አገልግሎቶች',
      'የእቃዎች አያያዝ',
      'የሙቀት ቁጥጥር ያለው መጠን',
      'የሙያ መለያዎች'
    ],
    price: 'From 12,000 ETB'
  },
  {
    id: 'storage',
    title: 'Storage Solutions',
    titleAm: 'የመጠን መፍትሄዎች',
    description: 'Secure and climate-controlled storage facilities for short and long-term needs.',
    descriptionAm: 'ለአጭር እና ረጅም ጊዜ ፍላጎቶች ደህንነቱ የተጣራ እና የሙቀት ቁጥጥር ያለው መጠን ተቋማት።',
    icon: Warehouse,
    features: [
      'Climate-controlled facilities',
      '24/7 security monitoring',
      'Flexible storage options',
      'Inventory tracking system',
      'Insurance coverage',
      'Easy access and retrieval'
    ],
    featuresAm: [
      'የሙቀት ቁጥጥር ያላቸው ተቋማት',
      '24/7 የደህንነት ቁጥጥር',
      'የተለያዩ የመጠን አማራጮች',
      'የእቃዎች መከታተል ስርዓት',
      'የመጣራ ሽፋን',
      'ቀላል መድረስ እና መውሰድ'
    ],
    price: 'Contact for pricing'
  },
  {
    id: 'office-relocation',
    title: 'Office Relocation',
    titleAm: 'የቢሮ መጓጓዣ',
    description: 'Complete office relocation services with minimal business disruption.',
    descriptionAm: 'የንግድ ስራ ጥፋት ሳያደርግ ሁለገብ የቢሮ መጓጓዣ አገልግሎቶች።',
    icon: Building,
    features: [
      'Minimal business disruption',
      'IT equipment handling',
      'Furniture assembly',
      'Document management',
      'After-hours service',
      'Project management'
    ],
    featuresAm: [
      'የንግድ ስራ ጥፋት ሳያደርግ',
      'የኮምፒዩተር መሣሪያዎች አያያዝ',
      'የቤት እቃዎች መገጣጠም',
      'የሰነዶች አያያዝ',
      'ከስራ ሰዓት በኋላ አገልግሎት',
      'የፕሮጀክት አያያዝ'
    ],
    price: 'From 45,000 ETB'
  }
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Fatima Ahmed',
    nameAm: 'ፋቲማ አህመድ',
    content: 'Excellent service! The team was professional, careful with our belongings, and completed the move on time. Highly recommended!',
    contentAm: 'በጣም ጥሩ አገልግሎት! ቡድኑ የሙያ ነበር፣ እቃዎቻችንን በጥንቃቄ አያዩ፣ እና መጓጓዣውን በጊዜ አጠናቀቁ። በጣም ይመከራል!',
    rating: 5,
    service: 'Local Moving',
    serviceAm: 'አካባቢያዊ መጓጓዣ',
    image: '/images/testimonials/fcg1.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-15'
  },
  {
    id: 2,
    
    name: 'Rajesh Patel',
    nameAm: 'ራጄሽ ፓቴል',
    content: 'Very reliable and efficient moving service. They handled our fragile items with extra care. Will definitely use them again.',
    contentAm: 'በጣም አስተማማኝ እና ውጤታማ የመጓጓዣ አገልግሎት። የተሰበሩ እቃዎቻችንን በተለየ ጥንቃቄ አያዩ። በእርግጥ እንደገና እንጠቀማቸዋለን።',
    rating: 5,
    service: 'Packaging',
    serviceAm: 'የመጠን አገልግሎት',
    image: '/images/testimonials/fcg2.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-10'
  },
  {
    id: 3,
    name: 'Yohannes Tekle',
    nameAm: 'ዮሐንስ ተክሌ',
    content: 'Professional team, competitive pricing, and excellent customer service. Made our office relocation stress-free.',
    contentAm: 'የሙያ ቡድን፣ ውድድር ያለው ዋጋ፣ እና ጥሩ የደንበኛ አገልግሎት። የቢሮ መጓጓዣችንን ያለ ግፍ አደረጉ።',
    rating: 5,
    service: 'Office Relocation',
    serviceAm: 'የቢሮ መጓጓዣ',
    image: '/images/testimonials/fcg3.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-08'
  },
  {
    id: 4,
    name: 'Sara Mohammed',
    nameAm: 'ሳራ መሐመድ',
    content: 'Great experience with their storage services. Clean facilities, good security, and very helpful staff.',
    contentAm: 'ከመጠን አገልግሎታቸው ጋር ጥሩ ስራት። ንፁህ ተቋማት፣ ጥሩ ደህንነት፣ እና በጣም ጠቃሚ ሰራተኞች።',
    rating: 5,
    service: 'Storage',
    serviceAm: 'መጠን',
    image: '/images/testimonials/fcg4.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-05'
  },
  {
    id: 5,
    name: 'Marta Haile',
    nameAm: 'ማርታ ኃይሌ',
    content: 'Fast, reliable, and professional service. They moved our entire house efficiently and everything arrived safely.',
    contentAm: 'ፈጣን፣ አስተማማኝ፣ እና የሙያ አገልግሎት። ቤታችንን በውጤታማነት አዛውረው እና ሁሉም ነገር በደህንነት ደረሰ።',
    rating: 5,
    service: 'Local Moving',
    serviceAm: 'አካባቢያዊ መጓጓዣ',
    image: '/images/testimonials/fcg5.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-03'
  },
  {
    id: 6,
    name: 'Martha Tadesse',
    nameAm: 'ማርታ ታደሰ',
    content: 'Outstanding customer service and attention to detail. They made our international move smooth and worry-free.',
    contentAm: 'የተሻለ የደንበኛ አገልግሎት እና ዝርዝር ትኩረት። ዓለም አቀፍ መጓጓዣችንን ለስላሳ እና ያለ ግፍ አደረጉ።',
    rating: 5,
    service: 'International Moving',
    serviceAm: 'ዓለም አቀፍ መጓጓዣ',
    image: '/images/testimonials/fc6.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-01'
  },
  {
    id: 7,
    name: 'Samson Alemu',
    nameAm: 'ሳምሶን አለሙ',
    content: 'Amazing experience! The team was incredibly professional and made our move completely stress-free. Everything was handled with care.',
    contentAm: 'ድንቅ ስራት! ቡድኑ በጣም የሙያ ነበር እና መጓጓዣችንን ሙሉ በሙሉ ያለ ግፍ አደረገ። ሁሉም ነገር በጥንቃቄ ተያያዘ።',
    rating: 5,
    service: 'Local Moving',
    serviceAm: 'አካባቢያዊ መጓጓዣ',
    image: '/images/testimonials/fcg7.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-20'
  },
  {
    id: 8,
    name: 'Tadesse Worku',
    nameAm: 'ታደሰ ወርቁ',
    content: 'Professional, reliable, and affordable. They moved our office efficiently with minimal disruption to our business operations.',
    contentAm: 'የሙያ፣ አስተማማኝ፣ እና ርካሽ። የንግድ ስራችንን ሳያደናቅፉ ቢሮችንን በውጤታማነት አዛውረው።',
    rating: 5,
    service: 'Office Relocation',
    serviceAm: 'የቢሮ መጓጓዣ',
    image: '/images/testimonials/fcg8.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-18'
  },
  {
    id: 9,
    
    name: 'Amina Hassan',
    nameAm: 'አሚና ሐሰን',
    content: 'Excellent packaging service! They handled our fragile items with utmost care. Highly recommend their professional approach.',
    contentAm: 'በጣም ጥሩ የመጠን አገልግሎት! የተሰበሩ እቃዎቻችንን በጣም በጥንቃቄ አያዩ። የሙያ አቀራረታቸውን በጣም እመክራለሁ።',
    rating: 5,
    service: 'Packaging',
    serviceAm: 'የመጠን አገልግሎት',
    image: '/images/testimonials/fcg9.jpg',
    location: 'Addis Ababa, Ethiopia',
    locationAm: 'አዲስ አበባ, ኢትዮጵያ',
    date: '2024-01-16'
  }
]

export const FAQS = [
  {
    question: 'How far in advance should I book my move?',
    questionAm: 'መጓጓዣዬን ስንት ቀደም ማስያዝ አለብኝ?',
    answer: 'We recommend booking at least 1-2 weeks in advance for local moves and 4-6 weeks for long-distance or international relocations.',
    answerAm: 'ለአካባቢያዊ መጓጓዣዎች ቢያንስ 1-2 ሳምንት ቀደም ማስያዝ እና ለረጅም ርቀት ወይም ዓለም አቀፍ መጓጓዣዎች 4-6 ሳምንት ቀደም ማስያዝ እንመክራለን።'
  },
  {
    question: 'Do you provide packing materials?',
    questionAm: 'የመጠን ቁሳቁሶች ይሰጣሉ?',
    answer: 'Yes, we provide all necessary packing materials including boxes, tape, bubble wrap, and protective materials.',
    answerAm: 'አዎ፣ ሁሉንም አስፈላጊ የመጠን ቁሳቁሶች እንደ ሳጥኖች፣ ቴፕ፣ ቡብል ራፕ፣ እና የጥበቃ ቁሳቁሶች እንሰጣለን።'
  },
  {
    question: 'Are your services insured?',
    questionAm: 'አገልግሎቶቻችሁ የተጣሩ ናቸው?',
    answer: 'Yes, all our services are fully insured. We provide comprehensive coverage for your belongings during the entire moving process.',
    answerAm: 'አዎ፣ ሁሉም አገልግሎቶቻችን ሙሉ በሙሉ የተጣሩ ናቸው። በመጓጓዣ ሂደቱ ወቅት ለእቃዎችዎ ሁለገብ ሽፋን እንሰጣለን።'
  },
  {
    question: 'What areas do you serve?',
    questionAm: 'የትኞች አካባቢዎችን እንደምንሰጥ?',
    answer: 'We primarily serve Addis Ababa and surrounding areas, including Bole, Kazanchis, Piassa, and nearby cities.',
    answerAm: 'በዋናነት አዲስ አበባ እና አካባቢዎችን እንደ ቦሌ፣ ካዛንቺስ፣ ፒያሳ፣ እና አጎራባች ከተማዎችን እንደምንሰጥ።'
  },
  {
    question: 'Do you offer same-day service?',
    questionAm: 'የተመሳሰለ ቀን አገልግሎት ይሰጣሉ?',
    answer: 'Yes, we offer same-day service for local moves depending on availability. Please contact us for immediate assistance.',
    answerAm: 'አዎ፣ ለአካባቢያዊ መጓጓዣዎች የተመሳሰለ ቀን አገልግሎት እንሰጣለን። ለፈጣን እርዳታ እባክዎ ያግኙን።'
  }
] 

export const BLOG_POSTS = [
  {
    id: '1',
    title: 'Essential Moving Tips for a Stress-Free Relocation',
    titleAm: 'ያለ ግፍ የመጓጓዣ ስራ ለማድረግ አስፈላጊ ምክሮች',
    excerpt: 'Learn the essential tips and tricks to make your move smooth and stress-free. From planning to execution, we cover everything you need to know.',
    excerptAm: 'መጓጓዣዎን ለስላሳ እና ያለ ግፍ ለማድረግ አስፈላጊ ምክሮችን ይወቁ። ከዕቅድ እስከ አፈጻጸም፣ ማወቅ ያለብዎትን ሁሉ እንሸፍናለን።',
    content: '<h2>Planning Your Move</h2><p>Proper planning is the key to a successful move. Start by creating a detailed timeline and checklist of all tasks that need to be completed.</p>',
    contentAm: '<h2>መጓጓዣዎን ማዘጋጀት</h2><p>ትክክለኛ ዕቅድ የተሳካከ መጓጓዣ መስተካከያ ነው። ለመጨረስ የሚያስፈልጉ ሁሉ ስራዎችን የያዘ ዝርዝር የጊዜ ሰሌዳ እና የስራ ዝርዝር በመፍጠር ይጀምሩ።</p>',
    author: 'Active Movers Team',
    publishedAt: new Date('2024-01-15'),
    readTime: 5,
    category: 'moving-tips',
    tags: ['Moving Tips', 'Planning', 'Organization'],
    tagsAm: ['የመጓጓዣ ምክሮች', 'ዕቅድ', 'ድርጅት']
  },
  {
    id: '2',
    title: 'Professional Packing Guide: Protect Your Valuables',
    titleAm: 'የሙያ የመጠን መመሪያ: እቃዎችዎን ያስጠብቁ',
    excerpt: 'Discover professional packing techniques to ensure your valuables arrive safely at your new home. Learn about materials, methods, and best practices.',
    excerptAm: 'እቃዎችዎ በደህንነት ወደ አዲሱ ቤትዎ እንዲደርሱ የሙያ የመጠን ቴክኒኮችን ያግኙ። ስለ ቁሳቁሶች፣ ዘዴዎች እና ምርጥ ስራዎች ይወቁ።',
    content: '<h2>Choosing the Right Packing Materials</h2><p>The foundation of successful packing lies in using the right materials. Quality packing supplies can make all the difference in protecting your belongings.</p>',
    contentAm: '<h2>ትክክለኛ የመጠን ቁሳቁሶችን መምረጥ</h2><p>የተሳካከ መጠን መሰረት ትክክለኛ ቁሳቁሶችን መጠቀም ነው። ጥራት ያላቸው የመጠን ቁሳቁሶች እቃዎችዎን ለመጠበቅ ሁሉንም ለውጥ ሊያደርጉ ይችላሉ።</p>',
    author: 'Active Movers Team',
    publishedAt: new Date('2024-01-20'),
    readTime: 7,
    category: 'packing-guide',
    tags: ['Packing', 'Fragile Items', 'Protection'],
    tagsAm: ['መጠን', 'የተሰበሩ እቃዎች', 'ጥበቃ']
  }
] 

 
