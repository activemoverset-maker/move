import { Metadata } from 'next'
import { AddBlogForm } from '@/components/admin/add-blog-form'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Add New Blog Post | Content Management',
  description: 'Create and publish new blog posts for Active Movers & Packers. Rich text editor with SEO optimization and content management tools.',
}

export default function AddBlogPage() {
  return (
    <div className="pt-16">
      <AddBlogForm />
    </div>
  )
} 