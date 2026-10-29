import Link from 'next/link'

import { ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import { buttonVariants } from '@/components/ui/button-variants'

import { getFeaturedGuides } from '@/lib/guide-data'

import { getGuideCategoryLabel } from '@/lib/guide-ui'

import { cn } from '@/lib/utils'



export function MovingGuidesSection() {

  const guides = getFeaturedGuides().slice(0, 4)



  if (guides.length === 0) return null



  return (

    <section className="section-padding border-y border-slate-200 bg-slate-50">

      <div className="container-max">

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">

            <Badge className="mb-3 border-slate-300 bg-slate-900 text-white hover:bg-slate-900">

              <BookOpen className="mr-1.5 h-3.5 w-3.5" />

              Reference guides

            </Badge>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">

              Addis Ababa moving guides

            </h2>

            <p className="mt-3 text-lg text-slate-600">

              Evergreen manuals for neighborhoods, condos, and pricing — separate from our news blog.

            </p>

          </div>

          <Link
            href="/guides"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'inline-flex w-fit items-center gap-2 border-teal-700 text-teal-800 hover:bg-teal-50'
            )}
          >
            Browse all guides
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>



        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">

          {guides.map((guide) => (

            <li key={guide.id}>

              <Link

                href={`/guides/${guide.slug}`}

                className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-teal-50/50 sm:flex-row sm:items-center sm:gap-4 sm:px-6"

              >

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">

                    {getGuideCategoryLabel(guide.category, 'en')}

                  </p>

                  <h3 className="font-semibold text-slate-900 group-hover:text-teal-800">{guide.title}</h3>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{guide.excerpt}</p>

                </div>

                <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">

                  <span className="flex items-center gap-1">

                    <Clock className="h-3.5 w-3.5" />

                    {guide.readTime} min

                  </span>

                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600" />

                </div>

              </Link>

            </li>

          ))}

        </ul>

      </div>

    </section>

  )

}


