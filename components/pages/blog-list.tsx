"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react'
import { BLOG_POSTS } from '@/constants/site'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { formatDate, generateSlug } from '@/lib/utils'

export function BlogList() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: language === 'am' ? 'ሁሉም' : 'All', nameAm: 'ሁሉም' },
    { id: 'moving-tips', name: 'Moving Tips', nameAm: 'የመጓጓዣ ምክሮች' },
    { id: 'packing-guide', name: 'Packing Guide', nameAm: 'የመጠን መመሪያ' },
    { id: 'storage-tips', name: 'Storage Tips', nameAm: 'የመጠን ምክሮች' },
    { id: 'company-news', name: 'Company News', nameAm: 'የኩባንያ ዜናዎች' },
  ]

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = language === 'am' 
      ? post.titleAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerptAm.toLowerCase().includes(searchTerm.toLowerCase())
      : post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const postsSorted = useMemo(() => {
    return [...filteredPosts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }, [filteredPosts])

  const showFeatured = searchTerm.trim() === '' && selectedCategory === 'all' && postsSorted.length > 0
  const featuredPost = showFeatured ? postsSorted[0] : null

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
    const c = categories.find(c => c.id === id)
    if (!c) return id
    return language === 'am' ? c.nameAm : c.name
  }

  const handleBlogClick = (postTitle: string) => {
    trackEvent({ 
      action: 'blog_click', 
      category: 'blog', 
      label: postTitle 
    })
  }

  const handleSearch = () => {
    trackEvent({ 
      action: 'blog_search', 
      category: 'blog', 
      label: searchTerm 
    })
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
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2 bg-white/20 text-white border-white/30">
              {language === 'am' ? 'የኩባንያ ዜናዎች' : 'Company Blog'}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {language === 'am' ? 'የመጓጓዣ ምክሮች እና ዜናዎች' : 'Moving Tips & News'}
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {language === 'am' 
                ? 'የመጓጓዣ ምክሮች፣ የመጠን መመሪያዎች እና የኩባንያ ዜናዎችን ያግኙ።' 
                : 'Get the latest moving tips, packing guides, and company news from our experts.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={language === 'am' ? 'የብሎግ ፈልግ...' : 'Search blogs...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-3"
                />
              </div>

              {/* Category Filter */}
              <div className="flex w-full lg:w-auto gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs sm:text-sm"
                  >
                    <Filter className="w-3 h-3 mr-1" />
                    {language === 'am' ? category.nameAm : category.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">{language === 'am' ? 'የተገኙ ፖስቶች' : 'Results'}: {filteredPosts.length}</div>
          </motion.div>

          {/* Featured Post */}
          {showFeatured && featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Cover */}
                  <div className={`relative h-56 sm:h-64 lg:h-full bg-gradient-to-br ${categoryGradient(featuredPost.category)}`}>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%)]" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/20 text-white border-white/30">{getCategoryName(featuredPost.category)}</Badge>
                    </div>
                  </div>
                  {/* Content */}
                  <CardContent className="p-6 lg:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{language === 'am' ? featuredPost.titleAm : featuredPost.title}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{language === 'am' ? featuredPost.excerptAm : featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredPost.publishedAt)}
                        <Separator orientation="vertical" className="h-4" />
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime} {language === 'am' ? 'ደቂቃ' : 'min read'}</span>
                      </div>
                      <Button asChild onClick={() => handleBlogClick(featuredPost.title)}>
                        <Link href={`/blog/${generateSlug(featuredPost.title)}`} className="flex items-center gap-2">
                          {language === 'am' ? 'ያንብቡ' : 'Read Article'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(showFeatured ? postsSorted.slice(1) : postsSorted).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={`/blog/${generateSlug(post.title)}`} onClick={() => handleBlogClick(post.title)}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border-0 shadow-md bg-white overflow-hidden">
                    {/* Cover */}
                    <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${categoryGradient(post.category)}`}>
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%)]" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs bg-white/20 text-white border-white/30">
                          {getCategoryName(post.category)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white/90">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                        {language === 'am' ? post.titleAm : post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {language === 'am' ? post.excerptAm : post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                          <Separator orientation="vertical" className="h-3" />
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

          {/* No Results Message */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No Results Found'}
                </h3>
                <p className="text-gray-600">
                  {language === 'am' 
                    ? 'የፈለጉትን የብሎግ ማግኘት አልተቻለም። እባክዎ ሌላ ፍለጋ ያድርጉ።' 
                    : 'We couldn\'t find any blogs matching your search. Please try a different search term.'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
} 
 
 