"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ArrowLeft, Save, BookOpen } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { generateSlug } from '@/lib/utils'

const GUIDE_CATEGORIES = [
  { id: 'area-guide', name: 'Area Guide', nameAm: 'የአካባቢ መመሪያ' },
  { id: 'service-guide', name: 'Service Guide', nameAm: 'የአገልግሎት መመሪያ' },
  { id: 'pricing-guide', name: 'Pricing & Planning', nameAm: 'ዋጋ መመሪያ' },
  { id: 'commercial-guide', name: 'Commercial', nameAm: 'ንግድ መመሪያ' },
  { id: 'checklist-guide', name: 'Checklist', nameAm: 'የማጣራት ዝርዝር' },
]

export function AddGuideForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagsInput, setTagsInput] = useState('')

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Active Movers Team',
    category: 'area-guide',
    readTime: 10,
    featuredImage: 'https://www.activemoverset.com/images/gallary/qua703.jpeg',
    slug: '',
    status: 'draft' as 'draft' | 'published',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const response = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags,
          slug: form.slug.trim() || generateSlug(form.title),
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create guide')
      }

      const created = await response.json()
      trackEvent({ action: 'guide_added', category: 'admin', label: form.title })
      router.push(`/guides/${created.slug}`)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to save guide')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pb-16">
      <section className="bg-gradient-to-br from-teal-700 via-primary to-green-700 text-white py-8">
        <div className="container-max flex items-center gap-4">
          <Button type="button" variant="outline" size="sm" className="border-white text-white" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {language === 'am' ? 'አዲስ መመሪያ' : 'Add Moving Guide'}
            </h1>
            <p className="text-green-100 text-sm mt-1">Saves JSON to data/guides/</p>
          </div>
        </div>
      </section>

      <div className="container-max section-padding max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Guide content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                placeholder={form.title ? generateSlug(form.title) : 'auto-from-title'}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                required
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {GUIDE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'am' ? c.nameAm : c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Content *</Label>
              <div className="mt-1">
                <RichTextEditor
                  content={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  placeholder="Write the guide..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="readTime">Read time (minutes)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min={1}
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="featuredImage">Featured image URL</Label>
              <Input
                id="featuredImage"
                value={form.featuredImage}
                onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                className="mt-1"
              />
            </div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save guide'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
