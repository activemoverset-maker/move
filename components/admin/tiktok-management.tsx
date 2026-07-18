'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TIKTOK_CATEGORIES } from '@/lib/tiktok/categories'
import { SOCIAL } from '@/lib/social'
import type { TikTokVideoPublic } from '@/lib/tiktok/types'
import type { TikTokCategory } from '@/lib/tiktok/types'

export function TikTokManagement() {
  const [videos, setVideos] = useState<TikTokVideoPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [category, setCategory] = useState<TikTokCategory>('moves')
  const [isFeatured, setIsFeatured] = useState(false)
  const [preview, setPreview] = useState<{
    title: string
    thumbnailUrl: string | null
  } | null>(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/tiktok')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load videos')
      setVideos(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load videos')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const previewUrl = async () => {
    if (!url.trim()) return
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/tiktok/oembed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Preview failed')
      setPreview({ title: data.title, thumbnailUrl: data.thumbnailUrl })
      if (!title) setTitle(data.title)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed')
      setPreview(null)
    } finally {
      setSaving(false)
    }
  }

  const addVideo = async () => {
    if (!url.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim() || undefined,
          titleAm: titleAm.trim() || undefined,
          category,
          isFeatured,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add video')
      setUrl('')
      setTitle('')
      setTitleAm('')
      setPreview(null)
      setIsFeatured(false)
      await fetchVideos()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add video')
    } finally {
      setSaving(false)
    }
  }

  const updateVideo = async (id: string, patch: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/tiktok/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Update failed')
      }
      await fetchVideos()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const deleteVideo = async (id: string) => {
    if (!confirm('Remove this video from the feed?')) return
    try {
      await fetch(`/api/admin/tiktok/${id}`, { method: 'DELETE' })
      await fetchVideos()
    } catch {
      setError('Failed to delete video')
    }
  }

  const moveVideo = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= videos.length) return
    const reordered = [...videos]
    const [item] = reordered.splice(index, 1)
    reordered.splice(target, 0, item)
    const payload = reordered.map((v, i) => ({ id: v.id, order: i }))
    setVideos(reordered.map((v, i) => ({ ...v, order: i })))
    await fetch('/api/admin/tiktok/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: payload }),
    })
  }

  return (
    <div className="container-max py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TikTok Feed</h1>
          <p className="text-gray-600">
            Manage videos for {SOCIAL.tiktok.handle} on the website
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tiktok" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View public page
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add video from {SOCIAL.tiktok.handle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tiktok-url">TikTok video URL</Label>
            <Input
              id="tiktok-url"
              placeholder={`https://www.tiktok.com/${SOCIAL.tiktok.handle}/video/...`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={previewUrl} disabled={saving || !url}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button type="button" onClick={addVideo} disabled={saving || !url}>
              Add to feed
            </Button>
          </div>
          {preview && (
            <div className="flex items-center gap-4 rounded-lg border bg-gray-50 p-4">
              {preview.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.thumbnailUrl}
                  alt=""
                  className="h-24 w-14 rounded object-cover"
                />
              )}
              <p className="text-sm font-medium">{preview.title}</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title-en">Title (English)</Label>
              <Input id="title-en" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="title-am">Title (Amharic)</Label>
              <Input id="title-am" value={titleAm} onChange={(e) => setTitleAm(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="mt-1 block rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as TikTokCategory)}
              >
                {TIKTOK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured on homepage
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Feed ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : videos.length === 0 ? (
            <p className="text-gray-500">
              No videos yet. Paste a {SOCIAL.tiktok.handle} URL above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  className="flex flex-wrap items-center gap-3 rounded-lg border p-4"
                >
                  {video.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="h-16 w-10 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{video.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline">{video.category}</Badge>
                      {video.isFeatured && (
                        <Badge className="bg-primary">Featured</Badge>
                      )}
                      {!video.isActive && <Badge variant="secondary">Hidden</Badge>}
                      <span className="text-xs text-gray-500">
                        {video.viewCountLocal} views on site
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveVideo(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveVideo(index, 1)}
                      disabled={index === videos.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVideo(video.id, { isFeatured: !video.isFeatured })}
                    >
                      <Star className={`h-4 w-4 ${video.isFeatured ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVideo(video.id, { isActive: !video.isActive })}
                    >
                      {video.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
