import { Metadata } from 'next'
import { BlogList } from '@/components/pages/blog-list'

export const metadata: Metadata = {
  title: 'Blog - Moving Tips & News',
  description: 'Read our latest blog posts about moving tips, packing advice, and industry news. Expert insights from Active Movers & Packers in Addis Ababa.',
  openGraph: {
    title: 'Blog - Moving Tips & News',
    description: 'Read our latest blog posts about moving tips, packing advice, and industry news.',
  },
}

export default function BlogPage() {
  return (
    <div className="pt-16">
      <BlogList />
    </div>
  )
} 
 
 
 