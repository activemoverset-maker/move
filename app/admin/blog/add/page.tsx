import { Metadata } from 'next'
import { AddBlogForm } from '@/components/admin/add-blog-form'

export const metadata: Metadata = {
  title: 'Add New Blog Post - Admin | Active Movers & Packers',
  description: 'Add new blog posts to the Active Movers & Packers website.',
}

export default function AddBlogPage() {
  return (
    <div className="pt-16">
      <AddBlogForm />
    </div>
  )
} 