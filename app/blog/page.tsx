import { Metadata } from 'next'
import { BlogList } from '@/components/pages/blog-list'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Blog | Moving Tips, News & Expert Advice for Addis Ababa',
  description: 'Expert moving tips, industry news, and professional advice from Active Movers & Packers. Learn about packing, moving, and storage solutions in Addis Ababa.',
  openGraph: {
    title: 'Active Movers & Packers - Blog | Moving Tips, News & Expert Advice for Addis Ababa',
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
 
 
 