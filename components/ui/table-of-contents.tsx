"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
  /** Only scan headings inside this selector (e.g. `.guide-content`) */
  contentRoot?: string
  title?: string
  activeClassName?: string
}

export function TableOfContents({
  className,
  contentRoot,
  title = 'Table of Contents',
  activeClassName = 'bg-primary text-white',
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const root = contentRoot ? document.querySelector(contentRoot) : document
    if (!root) {
      setHeadings([])
      return
    }
    const elements = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const items: TocItem[] = elements.map((element, index) => {
      if (!element.id) {
        element.id = `heading-${index}-${(element.textContent || 'section').slice(0, 40).replace(/\s+/g, '-').toLowerCase()}`
      }
      return {
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
      }
    })
    setHeadings(items)
  }, [contentRoot])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -35% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
        {title}
      </h3>
      <nav className="space-y-1">
        {headings.map((heading, index) => (
          <motion.button
            key={heading.id ? `${heading.id}-${index}` : `toc-${index}`}
            onClick={() => scrollToHeading(heading.id)}
            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-2 ${
              activeId === heading.id
                ? activeClassName
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeId === heading.id && <ChevronRight className="w-3 h-3" />}
            <span className="truncate">{heading.text}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  )
}
