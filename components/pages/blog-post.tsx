"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
  Eye,
  Play
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { formatDate, generateSlug } from '@/lib/utils'
import { processVideoEmbed } from '@/lib/video-utils'

interface BlogPostProps {
  post: {
    id: string
    title: string
    titleAm: string
    excerpt: string
    excerptAm: string
    content: string
    contentAm: string
    author: string
    publishedAt: Date
    readTime: number
    category: string
    tags: string[]
    tagsAm: string[]
    featuredImage?: string
    images?: string[]
    videos?: Array<{
      id: string
      type: string
      url: string
      title: string
      description?: string
      thumbnail?: string
      embedCode?: string
    }>
    views?: number
  }
}

export function BlogPost({ post }: BlogPostProps) {
  const { language } = useLanguage()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'am' ? post.titleAm : post.title,
        text: language === 'am' ? post.excerptAm : post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
    
    trackEvent({ 
      action: 'blog_share', 
      category: 'blog', 
      label: post.title 
    })
  }

  const handleBackClick = () => {
    trackEvent({ 
      action: 'blog_back_click', 
      category: 'navigation', 
      label: 'Blog to Blog List' 
    })
  }

  const renderVideoEmbed = (video: any) => {
    const videoEmbed = {
      type: video.type as any,
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      embedCode: video.embedCode
    }
    
    return (
      <div 
        key={video.id}
        className="my-6"
        dangerouslySetInnerHTML={{ __html: processVideoEmbed(videoEmbed) }}
      />
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-green-600 to-green-700 text-white py-16 sm:py-20">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mb-6 border-white text-white hover:bg-white/10"
              onClick={handleBackClick}
            >
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'am' ? 'ወደ ብሎግ ይመለሱ' : 'Back to Blog'}
              </Link>
            </Button>
            
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2 bg-white/20 text-white border-white/30">
              {language === 'am' ? 'የኩባንያ ዜናዎች' : 'Company Blog'}
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {language === 'am' ? post.titleAm : post.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-6">
              {language === 'am' ? post.excerptAm : post.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-green-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} {language === 'am' ? 'ደቂቃ ያስተናግዛል' : 'min read'}</span>
              </div>
              {post.views && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} {language === 'am' ? 'ዕይታዎች' : 'views'}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-3"
            >
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6 sm:p-8">
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="mb-8">
                      <Image
                        src={post.featuredImage}
                        alt={language === 'am' ? post.titleAm : post.title}
                        width={800}
                        height={400}
                        className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: language === 'am' ? post.contentAm : post.content 
                      }}
                    />
                  </div>

                  {/* Additional Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === 'am' ? 'ተጨማሪ ስዕሎች' : 'Additional Images'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {post.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`${language === 'am' ? post.titleAm : post.title} - Image ${index + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {post.videos && post.videos.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        {language === 'am' ? 'ቪዲዮዎች' : 'Videos'}
                      </h3>
                      <div className="space-y-6">
                        {post.videos.map((video) => renderVideoEmbed(video))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'am' ? 'መለያዎች' : 'Tags'}:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'am' ? post.tagsAm : post.tags).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-primary text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="space-y-6">
                {/* Share Card */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {language === 'am' ? 'ያጋራ' : 'Share This Post'}
                    </h3>
                    <Button 
                      onClick={handleShare}
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {language === 'am' ? 'ያጋራ' : 'Share'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Author Card */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {language === 'am' ? 'ደራሲ' : 'About the Author'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-600">
                          {language === 'am' ? 'የመጓጓዣ ሙያ ባለሙያ' : 'Moving Expert'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {language === 'am' ? 'ተዛማጅ ፖስቶች' : 'Related Posts'}
                    </h3>
                    <div className="space-y-3">
                      <Link 
                        href="/blog" 
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {language === 'am' ? 'ሁሉም የብሎግ ፖስቶችን ይመልከቱ' : 'View all blog posts'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {language === 'am' ? 'ተጨማሪ ምክሮች እና ዜናዎች' : 'More tips and news'}
                        </p>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
} 
 
 
 