"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { generateSlug, formatDate } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

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
}

export function RelatedPosts({ currentPostId, category, tags, posts, className }: RelatedPostsProps) {
  const { language } = useLanguage()

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
    const categories = {
      'moving-tips': { name: 'Moving Tips', nameAm: 'የመጓጓዣ ምክሮች' },
      'packing-guide': { name: 'Packing Guide', nameAm: 'የመጠን መመሪያ' },
      'storage-tips': { name: 'Storage Tips', nameAm: 'የመጠን ምክሮች' },
      'company-news': { name: 'Company News', nameAm: 'የኩባንያ ዜናዎች' },
    }
    const cat = categories[id as keyof typeof categories]
    return language === 'am' ? cat?.nameAm : cat?.name || id
  }

  return (
    <div className={`bg-gray-50 py-12 ${className}`}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {language === 'am' ? 'ተዛማጅ ፖስቶች' : 'Related Posts'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'am' 
              ? 'ተጨማሪ ምክሮች እና መረጃዎችን ያግኙ' 
              : 'Discover more tips and insights from our experts'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-0 shadow-md bg-white overflow-hidden">
                  {/* Cover */}
                  <div className={`relative h-40 bg-gradient-to-br ${categoryGradient(post.category)}`}>
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
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                        {language === 'am' ? 'ያንብቡ' : 'Read More'}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
