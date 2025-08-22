"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Undo,
  Redo
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      YouTube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor || !isClient) {
    return (
      <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
        <div className="p-4 min-h-[300px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    )
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const addYoutube = () => {
    if (youtubeUrl) {
      // Extract video ID from YouTube URL
      const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run()
        setYoutubeUrl('')
        setShowYoutubeInput(false)
      }
    }
  }

  const MenuBar = () => (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg">
      <Button
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8 px-2"
      >
        H1
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8 px-2"
      >
        H2
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8 px-2"
      >
        H3
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
      >
        <List className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      
      <Button
        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-8 w-8 p-0"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLinkInput(!showLinkInput)}
        className="h-8 w-8 p-0"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowImageInput(!showImageInput)}
        className="h-8 w-8 p-0"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowYoutubeInput(!showYoutubeInput)}
        className="h-8 w-8 p-0"
      >
        <Youtube className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <MenuBar />
      
      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addLink()}
            />
            <Button size="sm" onClick={addLink} disabled={!linkUrl}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
            />
            <Button size="sm" onClick={addImage} disabled={!imageUrl}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowImageInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* YouTube Input */}
      {showYoutubeInput && (
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter YouTube URL..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addYoutube()}
            />
            <Button size="sm" onClick={addYoutube} disabled={!youtubeUrl}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowYoutubeInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[300px] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  )
}
