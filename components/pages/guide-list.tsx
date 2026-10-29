"use client"



import { useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Input } from '@/components/ui/input'

import {

  Search,

  Clock,

  ArrowRight,

  BookOpen,

  MapPin,

  Truck,

  Calculator,

  Building2,

  ListChecks,

  Newspaper,

  ChevronRight,

} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

import { trackEvent } from '@/lib/analytics'

import { GUIDE_CATEGORIES, GUIDE_CATEGORY_META, getGuideCategoryLabel } from '@/lib/guide-ui'
import { cn } from '@/lib/utils'



interface GuideListItem {

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



interface GuideListProps {

  posts: GuideListItem[]

}



const categoryIcon: Record<string, typeof MapPin> = {

  'area-guide': MapPin,

  'service-guide': Truck,

  'pricing-guide': Calculator,

  'commercial-guide': Building2,

  'checklist-guide': ListChecks,

}



export function GuideList({ posts }: GuideListProps) {

  const { language } = useLanguage()

  const lang = language === 'am' ? 'am' : 'en'

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedCategory, setSelectedCategory] = useState('all')



  const filteredPosts = posts.filter((post) => {

    const q = searchTerm.toLowerCase()

    const matchesSearch =

      language === 'am'

        ? (post.titleAm && post.titleAm.toLowerCase().includes(q)) ||

          (post.excerptAm && post.excerptAm.toLowerCase().includes(q)) ||

          post.title.toLowerCase().includes(q) ||

          post.excerpt.toLowerCase().includes(q)

        : post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)



    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

    return matchesSearch && matchesCategory

  })



  const postsSorted = useMemo(

    () => [...filteredPosts].sort((a, b) => a.title.localeCompare(b.title)),

    [filteredPosts]

  )



  const handleGuideClick = (postTitle: string) => {

    trackEvent({ action: 'guide_click', category: 'guides', label: postTitle })

  }



  return (

    <>

      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-white">

        <div

          className="pointer-events-none absolute inset-0 opacity-40"

          style={{

            backgroundImage:

              'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',

            backgroundSize: '32px 32px',

          }}

        />

        <div className="container-max relative py-14 sm:py-16">

          <motion.div

            initial={{ opacity: 0, y: 16 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.5 }}

            className="max-w-3xl"

          >

            <Badge className="mb-4 border border-teal-500/40 bg-teal-500/10 text-teal-200 hover:bg-teal-500/10">

              <BookOpen className="mr-1.5 h-3.5 w-3.5" />

              {language === 'am' ? 'የማጣካ መመሪያ መዝገበ-ቃላት' : 'Reference library — not the blog'}

            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">

              {language === 'am' ? 'የመጓጓዣ መመሪያዎች' : 'Moving guides'}

            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-300">

              {language === 'am'

                ? 'አካባቢ፣ ኮንዶ፣ ዋጋ እና ንግድ relocation — ለአዲስ አበባ የተጻፉ ረጅም መመሪያዎች።'

                : 'Long-form, evergreen guides for Addis Ababa — neighborhoods, condos, pricing, and commercial moves. Sorted A–Z for lookup, not news.'}

            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">

              <span>

                {posts.length}+ {language === 'am' ? 'መመሪያዎች' : 'guides'}

              </span>

              <span aria-hidden>·</span>

              <span>{language === 'am' ? 'በብሎግ ላይ ዜና እና አጭር ምክሮች' : 'News & short tips live on the blog'}</span>

            </div>

          </motion.div>

        </div>

      </section>



      <section className="section-padding bg-slate-100/80">

        <div className="container-max">

          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">

            <div className="relative flex-1 sm:max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input

                type="search"

                placeholder={language === 'am' ? 'መመሪያ ፈልግ...' : 'Search guides by title or topic...'}

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                className="border-slate-200 bg-slate-50 pl-10"

              />

            </div>

            <p className="mt-3 text-sm text-slate-600 sm:mt-0">

              {language === 'am' ? 'ውጤቶች' : 'Showing'}{' '}

              <strong className="text-slate-900">{filteredPosts.length}</strong>

            </p>

          </div>



          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">

            <aside className="hidden lg:block">

              <nav className="sticky top-24 space-y-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">

                  {language === 'am' ? 'ምድብ' : 'Browse by type'}

                </p>

                {GUIDE_CATEGORIES.map((category) => {

                  const active = selectedCategory === category.id

                  return (

                    <button

                      key={category.id}

                      type="button"

                      onClick={() => setSelectedCategory(category.id)}

                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${

                        active ? 'bg-teal-600 font-medium text-white' : 'text-slate-700 hover:bg-slate-100'

                      }`}

                    >

                      {language === 'am' ? category.nameAm : category.name}

                    </button>

                  )

                })}

              </nav>

            </aside>



            <div>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">

                {GUIDE_CATEGORIES.map((category) => (

                  <Button

                    key={category.id}

                    variant={selectedCategory === category.id ? 'default' : 'outline'}

                    size="sm"

                    className="whitespace-nowrap text-xs"

                    onClick={() => setSelectedCategory(category.id)}

                  >

                    {language === 'am' ? category.nameAm : category.name}

                  </Button>

                ))}

              </div>



              <ul className="space-y-3">

                {postsSorted.map((post, index) => {

                  const meta = GUIDE_CATEGORY_META[post.category]

                  const Icon = categoryIcon[post.category] || BookOpen

                  return (

                    <motion.li

                      key={post.id}

                      initial={{ opacity: 0, y: 12 }}

                      animate={{ opacity: 1, y: 0 }}

                      transition={{ delay: Math.min(index * 0.02, 0.4) }}

                    >

                      <Link

                        href={`/guides/${post.slug}`}

                        onClick={() => handleGuideClick(post.title)}

                        className={`group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md sm:p-5 ${

                          meta ? `border-l-4 ${meta.border}` : 'border-l-4 border-slate-300'

                        }`}

                      >

                        <div

                          className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg sm:flex ${

                            meta?.bg || 'bg-slate-100'

                          } ${meta?.accent || 'text-slate-600'}`}

                        >

                          <Icon className="h-6 w-6" aria-hidden />

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="mb-1 flex flex-wrap items-center gap-2">

                            <Badge

                              variant="outline"

                              className={`text-[10px] font-medium uppercase tracking-wide ${

                                meta?.accent || 'text-slate-600'

                              }`}

                            >

                              {getGuideCategoryLabel(post.category, lang)}

                            </Badge>

                            <span className="flex items-center gap-1 text-xs text-slate-500">

                              <Clock className="h-3 w-3" />

                              {post.readTime} {language === 'am' ? 'ደቂቃ' : 'min'}

                            </span>

                          </div>

                          <h2 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700 sm:text-xl">

                            {language === 'am' && post.titleAm ? post.titleAm : post.title}

                          </h2>

                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">

                            {language === 'am' && post.excerptAm ? post.excerptAm : post.excerpt}

                          </p>

                        </div>

                        <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" />

                      </Link>

                    </motion.li>

                  )

                })}

              </ul>



              {filteredPosts.length === 0 && (

                <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-600">

                  {language === 'am' ? 'ምንም መመሪያ አልተገኘም።' : 'No guides match your search.'}

                </div>

              )}



              <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-700">

                    <Newspaper className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">

                      {language === 'am' ? 'የቅርብ ጊዜ ምክሮች?' : 'Looking for latest tips & news?'}

                    </p>

                    <p className="text-sm text-slate-600">

                      {language === 'am'

                        ? 'የኩባንያ ብሎግ — አጭር ጽሑፎች እና ዜና።'

                        : 'Our blog has shorter articles, promos, and company updates.'}

                    </p>

                  </div>

                </div>

                <Link
                  href="/blog"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'inline-flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50'
                  )}
                >
                  {language === 'am' ? 'ወደ ብሎግ' : 'Go to blog'}
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>

  )

}


