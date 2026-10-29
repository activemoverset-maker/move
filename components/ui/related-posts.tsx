"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, ChevronRight, BookOpen } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { GUIDE_CATEGORY_META, getGuideCategoryLabel } from '@/lib/guide-ui'

interface BlogPost {
  id: string
  title: string
  titleAm: string
  slug: string
  excerpt: string
  excerptAm: string
  publishedAt: Date
  category: string
  tags: string[]
  tagsAm: string[]
  readTime: number
  featuredImage: string | null
  views: number
  author: string
}

interface RelatedPostsProps {
  currentPostId: string
  category: string
  tags: string[]
  posts: BlogPost[]
  className?: string
  /** Base path for post links, e.g. `/blog` or `/guides` */
  linkBasePath?: string
  sectionLabel?: { en: string; am: string }
  sectionSubtitle?: { en: string; am: string }
  variant?: 'blog' | 'guide'
}

export function RelatedPosts({
  currentPostId,
  category,
  tags,
  posts,
  className,
  linkBasePath = '/blog',
  sectionLabel,
  sectionSubtitle,
  variant = 'blog',
}: RelatedPostsProps) {
  const { language } = useLanguage()
  const lang = language === 'am' ? 'am' : 'en'

  // Find related posts based on category and tags
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .filter(post => post.category === category || post.tags.some(tag => tags.includes(tag)))
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  const categoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'moving-tips':
        return 'from-green-600 via-green-500 to-green-400'
      case 'packing-guide':
        return 'from-blue-600 via-blue-500 to-cyan-400'
      case 'storage-tips':
        return 'from-purple-600 via-fuchsia-500 to-pink-400'
      case 'company-news':
        return 'from-amber-600 via-orange-500 to-yellow-400'
      default:
        return 'from-slate-600 via-slate-500 to-slate-400'
    }
  }

  const getCategoryName = (id: string) => {
    const categories: Record<string, { name: string; nameAm: string }> = {
      'moving-tips': { name: 'Moving Tips', nameAm: 'የመጓጓዣ ምክሮች' },
      'packing-guide': { name: 'Packing Guide', nameAm: 'የመጠን መመሪያ' },
      'storage-tips': { name: 'Storage Tips', nameAm: 'የመጠን ምክሮች' },
      'company-news': { name: 'Company News', nameAm: 'የኩባንያ ዜናዎች' },
      'area-guide': { name: 'Area Guide', nameAm: 'የአካባቢ መመሪያ' },
      'service-guide': { name: 'Service Guide', nameAm: 'የአገልግሎት መመሪያ' },
      'pricing-guide': { name: 'Pricing Guide', nameAm: 'ዋጋ መመሪያ' },
      'commercial-guide': { name: 'Commercial Guide', nameAm: 'ንግድ መመሪያ' },
      'checklist-guide': { name: 'Checklist', nameAm: 'የማጣራት ዝርዝር' },
    }
    const cat = categories[id]
    return language === 'am' ? cat?.nameAm : cat?.name || id
  }

  const categoryGradientExtended = (categoryId: string) => {
    switch (categoryId) {
      case 'area-guide':
        return 'from-emerald-600 via-teal-500 to-cyan-400'
      case 'service-guide':
        return 'from-green-600 via-green-500 to-green-400'
      case 'pricing-guide':
        return 'from-amber-600 via-orange-500 to-yellow-400'
      case 'commercial-guide':
        return 'from-indigo-600 via-violet-500 to-purple-400'
      case 'checklist-guide':
        return 'from-sky-600 via-blue-500 to-indigo-400'
      default:
        return categoryGradient(categoryId)
    }
  }

  return (
    <div className={`py-12 ${variant === 'guide' ? 'bg-slate-100 border-t border-slate-200' : 'bg-gray-50'} ${className}`}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={variant === 'guide' ? 'mb-8 max-w-2xl' : 'text-center mb-8'}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${variant === 'guide' ? 'text-slate-900' : ''}`}>
            {sectionLabel
              ? language === 'am'
                ? sectionLabel.am
                : sectionLabel.en
              : language === 'am'
                ? 'ተዛማጅ ፖስቶች'
                : 'Related Posts'}
          </h2>
          <p className={`text-gray-600 ${variant === 'guide' ? '' : 'max-w-2xl mx-auto'}`}>
            {sectionSubtitle
              ? language === 'am'
                ? sectionSubtitle.am
                : sectionSubtitle.en
              : language === 'am'
                ? 'ተጨማሪ ምክሮች እና መረጃዎችን ያግኙ'
                : 'Discover more tips and insights from our experts'}
          </p>
        </motion.div>

        {variant === 'guide' ? (
          <ul className="space-y-3 max-w-3xl">
            {relatedPosts.map((post, index) => {
              const meta = GUIDE_CATEGORY_META[post.category]
              return (
                <motion.li
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={`${linkBasePath}/${post.slug}`}
                    className={`group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-400 ${
                      meta ? `border-l-4 ${meta.border}` : 'border-l-4 border-slate-300'
                    }`}
                  >
                    <BookOpen className={`h-5 w-5 shrink-0 ${meta?.accent || 'text-slate-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {getGuideCategoryLabel(post.category, lang)}
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 line-clamp-2">
                        {language === 'am' && post.titleAm ? post.titleAm : post.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {post.readTime} {language === 'am' ? 'ደቂቃ' : 'min'}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-teal-600" />
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={`${linkBasePath}/${post.slug}`}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-0 shadow-md bg-white overflow-hidden">
                  {/* Cover */}
                  <div className={`relative h-40 bg-gradient-to-br ${categoryGradientExtended(post.category)}`}>
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%)]" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {getCategoryName(post.category)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white/90">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                      {language === 'am' && post.titleAm ? post.titleAm : post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {language === 'am' && post.excerptAm ? post.excerptAm : post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} {language === 'am' ? 'ደቂቃ' : 'min read'}</span>
                      </div>
                      <span
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'group-hover:bg-primary group-hover:text-white group-hover:border-primary pointer-events-none'
                        )}
                      >
                        {language === 'am' ? 'ያንብቡ' : 'Read More'}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
