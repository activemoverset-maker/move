"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  BookOpen,
  Calendar,
  User,
  Tag,
  Image,
  Video,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { trackEvent } from '@/lib/analytics'
import { VideoEmbed } from '@/lib/video-utils'

interface BlogFormData {
  title: string
  titleAm: string
  excerpt: string
  excerptAm: string
  content: string
  contentAm: string
  author: string
  category: string
  tags: string[]
  tagsAm: string[]
  readTime: number
  featuredImage: string
  images: string[]
  videos: VideoEmbed[]
  status: 'draft' | 'published'
}

export function AddBlogForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    titleAm: '',
    excerpt: '',
    excerptAm: '',
    content: '',
    contentAm: '',
    author: '',
    category: '',
    tags: [],
    tagsAm: [],
    readTime: 5,
    featuredImage: '',
    images: [],
    videos: [],
    status: 'draft'
  })
  const [newTag, setNewTag] = useState('')
  const [newTagAm, setNewTagAm] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newVideo, setNewVideo] = useState<Partial<VideoEmbed>>({
    type: 'youtube',
    url: '',
    title: '',
    description: ''
  })

  const categories = [
    { id: 'moving-tips', name: 'Moving Tips', nameAm: 'የመጓጓዣ ምክሮች' },
    { id: 'packing-guide', name: 'Packing Guide', nameAm: 'የመጠን መመሪያ' },
    { id: 'storage-tips', name: 'Storage Tips', nameAm: 'የመጠን ምክሮች' },
    { id: 'company-news', name: 'Company News', nameAm: 'የኩባንያ ዜናዎች' },
  ]

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleAddTagAm = () => {
    if (newTagAm.trim() && !formData.tagsAm.includes(newTagAm.trim())) {
      setFormData(prev => ({
        ...prev,
        tagsAm: [...prev.tagsAm, newTagAm.trim()]
      }))
      setNewTagAm('')
    }
  }

  const handleRemoveTag = (tagToRemove: string, isAmharic = false) => {
    if (isAmharic) {
      setFormData(prev => ({
        ...prev,
        tagsAm: prev.tagsAm.filter(tag => tag !== tagToRemove)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }))
    }
  }

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }))
  }

  const handleAddVideo = () => {
    if (newVideo.url && newVideo.title && newVideo.type) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, newVideo as VideoEmbed]
      }))
      setNewVideo({ type: 'youtube', url: '', title: '', description: '' })
    }
  }

  const handleRemoveVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        trackEvent({ 
          action: 'blog_added', 
          category: 'admin', 
          label: formData.title 
        })
        router.push('/admin/blog')
      } else {
        throw new Error('Failed to create blog post')
      }
    } catch (error) {
      console.error('Error adding blog:', error)
      alert('Failed to create blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackClick = () => {
    trackEvent({ 
      action: 'admin_back_click', 
      category: 'navigation', 
      label: 'Add Blog to Admin' 
    })
    router.back()
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary via-green-600 to-green-700 text-white py-8">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white/10"
                onClick={handleBackClick}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'am' ? 'ይመለሱ' : 'Back'}
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {language === 'am' ? 'አዲስ የብሎግ ፖስት ያክሉ' : 'Add New Blog Post'}
                </h1>
                <p className="text-green-100 mt-1">
                  {language === 'am' ? 'የብሎግ ፖስት ለመጨመር ቅጹን ይሙሉ' : 'Fill out the form to add a new blog post'}
                </p>
              </div>
            </div>
            <BookOpen className="w-8 h-8 text-white/80" />
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {language === 'am' ? 'የብሎግ መረጃ' : 'Blog Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Title (English) *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                        placeholder="Enter blog title in English"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="titleAm" className="text-sm font-medium text-gray-700">
                        Title (Amharic) *
                      </Label>
                      <Input
                        id="titleAm"
                        value={formData.titleAm}
                        onChange={(e) => handleInputChange('titleAm', e.target.value)}
                        required
                        placeholder="የብሎግ ስም በአማርኛ ያስገቡ"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                        Excerpt (English) *
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        required
                        placeholder="Enter blog excerpt in English"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerptAm" className="text-sm font-medium text-gray-700">
                        Excerpt (Amharic) *
                      </Label>
                      <Textarea
                        id="excerptAm"
                        value={formData.excerptAm}
                        onChange={(e) => handleInputChange('excerptAm', e.target.value)}
                        required
                        placeholder="የብሎግ ማጠቃለያ በአማርኛ ያስገቡ"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                        Content (English) *
                      </Label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => handleInputChange('content', content)}
                        placeholder="Start writing your blog content in English..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentAm" className="text-sm font-medium text-gray-700">
                        Content (Amharic) *
                      </Label>
                      <RichTextEditor
                        content={formData.contentAm}
                        onChange={(content) => handleInputChange('contentAm', content)}
                        placeholder="የብሎግ ይዘትዎን በአማርኛ ይፃፉ..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Author and Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                        Author *
                      </Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        required
                        placeholder="Enter author name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category *
                      </Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {language === 'am' ? category.nameAm : category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="readTime" className="text-sm font-medium text-gray-700">
                        Read Time (minutes)
                      </Label>
                      <Input
                        id="readTime"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.readTime}
                        onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    {language === 'am' ? 'የመገናኛ አይነቶች' : 'Media Content'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Featured Image */}
                  <div>
                    <Label htmlFor="featuredImage" className="text-sm font-medium text-gray-700">
                      Featured Image URL
                    </Label>
                    <Input
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Additional Images
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                          <Image className="w-3 h-3" />
                          {image.substring(0, 20)}...
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Image URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddImage}
                        disabled={!newImage.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Videos */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Videos
                    </Label>
                    <div className="mt-2 space-y-3">
                      {formData.videos.map((video, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Video className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{video.title}</span>
                          <Badge variant="outline" className="text-xs border-primary text-primary">{video.type}</Badge>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="ml-auto hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Video Type</Label>
                          <select
                            value={newVideo.type}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, type: e.target.value as any }))}
                            className="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="custom">Custom Embed</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Video URL</Label>
                          <Input
                            value={newVideo.url}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="Video URL"
                            className="mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Title</Label>
                          <Input
                            value={newVideo.title}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Video title"
                            className="mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Description</Label>
                          <Input
                            value={newVideo.description}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Video description"
                            className="mt-1 text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddVideo}
                        disabled={!newVideo.url || !newVideo.title}
                        className="mt-3"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    {language === 'am' ? 'መለያዎች' : 'Tags'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* English Tags */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags (English)</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Amharic Tags */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags (Amharic)</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tagsAm.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag, true)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newTagAm}
                        onChange={(e) => setNewTagAm(e.target.value)}
                        placeholder="መለያ ያክሉ"
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTagAm())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTagAm}
                        disabled={!newTagAm.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-green-700 text-white px-8 py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === 'am' ? 'ያስቀምጣል...' : 'Saving...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {language === 'am' ? 'ያስቀምጡ' : 'Save Blog Post'}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
} 
 
 
 