"use client"



import { motion } from 'framer-motion'

import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Card, CardContent } from '@/components/ui/card'

import { ReadingProgress } from '@/components/ui/reading-progress'

import { TableOfContents } from '@/components/ui/table-of-contents'

import { RelatedPosts } from '@/components/ui/related-posts'

import {

  Clock,

  ArrowLeft,

  Share2,

  Tag,

  BookOpen,

  Phone,

  Calendar,

  ChevronRight,

  Newspaper,

} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

import { trackEvent } from '@/lib/analytics'

import { cn, formatDate } from '@/lib/utils'

import { SITE_CONFIG } from '@/constants/site'

import { GUIDE_CATEGORY_META, getGuideCategoryLabel } from '@/lib/guide-ui'



interface GuidePostProps {

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

    featuredImage: string | null

    images: string[]

    views: number

    updatedAt?: Date

    slug: string

  }

  relatedPosts?: Array<{

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

  }>

}



export function GuidePost({ post, relatedPosts }: GuidePostProps) {

  const { language, t } = useLanguage()

  const lang = language === 'am' ? 'am' : 'en'

  const meta = GUIDE_CATEGORY_META[post.category]

  const updated = post.updatedAt || post.publishedAt

  const title = language === 'am' && post.titleAm ? post.titleAm : post.title

  const excerpt = language === 'am' && post.excerptAm ? post.excerptAm : post.excerpt



  const handleShare = () => {

    if (navigator.share) {

      navigator.share({ title, text: excerpt, url: window.location.href })

    } else {

      navigator.clipboard.writeText(window.location.href)

    }

    trackEvent({ action: 'guide_share', category: 'guides', label: post.title })

  }



  return (

    <>

      <ReadingProgress />



      <div className="border-b border-slate-200 bg-white">

        <div className="container-max py-4">

          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

            <Link href="/guides" className="hover:text-teal-700">

              {language === 'am' ? 'መመሪያዎች' : 'Guides'}

            </Link>

            <ChevronRight className="h-3.5 w-3.5" aria-hidden />

            <span className="line-clamp-1 font-medium text-slate-800">{title}</span>

          </nav>

        </div>

      </div>



      <section className={`border-b border-slate-200 ${meta?.bg || 'bg-slate-50'}`}>

        <div className="container-max py-10 sm:py-12">

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 text-slate-600 hover:text-teal-800"
            >
              <Link href="/guides">
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {language === 'am' ? 'ሁሉም መመሪያዎች' : 'All guides'}
                </span>
              </Link>
            </Button>



            <div className="flex flex-wrap items-center gap-2">

              <Badge className="border border-teal-200 bg-teal-600 text-white hover:bg-teal-600">

                <BookOpen className="mr-1 h-3 w-3" />

                {language === 'am' ? 'የማጣካ መመሪያ' : 'Reference guide'}

              </Badge>

              <Badge variant="outline" className={`${meta?.accent || 'text-slate-700'} border-slate-300 bg-white`}>

                {getGuideCategoryLabel(post.category, lang)}

              </Badge>

            </div>



            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">

              {title}

            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">{excerpt}</p>



            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">

              <div className="flex items-center gap-2">

                <Clock className="h-4 w-4 text-teal-600" />

                <dt className="sr-only">Read time</dt>

                <dd>

                  {post.readTime} {language === 'am' ? 'ደቂቃ' : 'min read'}

                </dd>

              </div>

              <div className="flex items-center gap-2">

                <Calendar className="h-4 w-4 text-teal-600" />

                <dt className="sr-only">Updated</dt>

                <dd>

                  {language === 'am' ? 'ተዘምኗል' : 'Updated'} {formatDate(updated)}

                </dd>

              </div>

            </dl>

          </motion.div>

        </div>

      </section>



      <section className="section-padding bg-slate-100/90">

        <div className="container-max">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">

            <motion.article

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              className="min-w-0"

            >

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 bg-teal-50/80 px-6 py-4 sm:px-8">

                  <p className="text-sm font-medium text-teal-900">

                    {language === 'am'

                      ? 'በዚህ መመሪያ ውስጥ — ተግባራዊ እርምጃዎች፣ FAQs እና booking።'

                      : 'In this guide — practical steps, FAQs, and links to book with clear pricing.'}

                  </p>

                </div>

                <div className="guide-content px-6 py-8 sm:px-8 sm:py-10">

                  <div

                    dangerouslySetInnerHTML={{

                      __html: language === 'am' && post.contentAm ? post.contentAm : post.content,

                    }}

                  />

                </div>

                <div className="border-t border-slate-100 px-6 py-6 sm:px-8">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">

                    {language === 'am' ? 'መለያዎች' : 'Topics'}

                  </p>

                  <div className="flex flex-wrap gap-2">

                    {(language === 'am' && post.tagsAm?.length ? post.tagsAm : post.tags).map((tag, index) => (

                      <Badge key={index} variant="outline" className="border-slate-300 bg-slate-50 text-slate-700">

                        <Tag className="mr-1 h-3 w-3" />

                        {tag}

                      </Badge>

                    ))}

                  </div>

                </div>

              </div>



              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-3">

                  <Newspaper className="mt-0.5 h-5 w-5 text-green-600" />

                  <p className="text-sm text-slate-600">

                    {language === 'am'

                      ? 'ይህ መመሪያ evergreen ነው። የቅርብ ጊዜ ዜና እና አጭር ምክሮች →'

                      : 'This is an evergreen guide. For news and shorter tips, visit the blog →'}

                  </p>

                </div>

                <Button asChild variant="outline" size="sm" className="shrink-0 border-green-600 text-green-700">
                  <Link href="/blog">
                    <span>{language === 'am' ? 'ብሎግ' : 'Blog'}</span>
                  </Link>
                </Button>

              </div>

            </motion.article>



            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

              <TableOfContents

                contentRoot=".guide-content"

                className="border border-slate-200 bg-white shadow-sm"

                title={language === 'am' ? 'በመመሪያ ውስጥ' : 'On this page'}

                activeClassName="bg-teal-600 text-white"

              />



              <Card className="overflow-hidden border border-teal-700 bg-slate-900 text-white shadow-lg">

                <CardContent className="p-5">

                  <h2 className="text-lg font-semibold">{language === 'am' ? 'መጓጓዣ ያስያዙ' : 'Book your move'}</h2>

                  <p className="mt-2 text-sm text-slate-300">

                    {language === 'am'

                      ? 'ነጻ ግምት ከ Active Movers — ከመመሪያ ወደ written quote።'

                      : 'Free survey and a written quote — turn this guide into a real plan.'}

                  </p>

                  <Link
                    href="/booking"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'mt-4 w-full bg-teal-500 text-white hover:bg-teal-400'
                    )}
                  >
                    {t('header.bookNow')}
                  </Link>
                  <a
                    href={`tel:${SITE_CONFIG.links.phone.replace(/\s/g, '')}`}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'mt-2 inline-flex w-full border-slate-600 text-white hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {SITE_CONFIG.links.phone}
                  </a>

                </CardContent>

              </Card>



              <Button onClick={handleShare} variant="outline" className="w-full border-slate-300 bg-white">

                <Share2 className="mr-2 h-4 w-4" />

                {language === 'am' ? 'መመሪያውን ያጋሩ' : 'Share this guide'}

              </Button>

            </aside>

          </div>

        </div>

      </section>



      {relatedPosts && relatedPosts.length > 0 && (

        <RelatedPosts

          currentPostId={post.id}

          category={post.category}

          tags={language === 'am' && post.tagsAm?.length ? post.tagsAm : post.tags}

          posts={relatedPosts}

          linkBasePath="/guides"

          variant="guide"

          sectionLabel={{ en: 'Related guides', am: 'ተዛማጅ መመሪያዎች' }}

          sectionSubtitle={{

            en: 'More reference guides on similar topics',

            am: 'በተመሳሳይ ጉዳይ ላይ ተጨማሪ መመሪያዎች',

          }}

        />

      )}

    </>

  )

}


