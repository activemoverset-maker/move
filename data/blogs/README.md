# JSON Blog Posts System

This directory contains JSON files for blog posts that can be managed separately from the database. This provides an easy way to add blog content without needing to use the admin interface.

## How It Works

The blog system now supports two sources for blog posts:
1. **Database posts** - Created through the admin interface
2. **JSON file posts** - Created by adding JSON files to this directory

Both sources are automatically combined and displayed on the blog pages.

## Creating a New Blog Post

To create a new blog post using JSON:

1. Create a new JSON file in this directory with a descriptive name (e.g., `my-new-blog-post.json`)
2. Use the following structure:

```json
{
  "id": "unique-post-id",
  "title": "Your Blog Post Title",
  "titleAm": "የእርስዎ የብሎግ ስራ ርዕስ",
  "excerpt": "A brief description of your blog post...",
  "excerptAm": "የብሎግ ስራዎ አጭር መግለጫ...",
  "content": "<h2>Your HTML Content</h2><p>Your blog post content with HTML formatting...</p>",
  "contentAm": "<h2>የእርስዎ የ HTML ይዘት</h2><p>የብሎግ ስራዎ ይዘት ከ HTML ቅርጸት ጋር...</p>",
  "author": "Author Name",
  "category": "moving-tips",
  "tags": ["tag1", "tag2", "tag3"],
  "tagsAm": ["መለያ1", "መለያ2", "መለያ3"],
  "readTime": 8,
  "featuredImage": "https://activemoverset.com/images/gallary/image.jpg",
  "images": [
    "https://activemoverset.com/images/gallary/image1.jpg",
    "https://activemoverset.com/images/gallary/image2.jpg"
  ],
  "status": "published",
  "publishedAt": "2024-01-20T00:00:00.000Z",
  "slug": "your-blog-post-slug"
}
```

## Required Fields

- `id`: Unique identifier for the post
- `title`: English title
- `titleAm`: Amharic title
- `excerpt`: English excerpt/description
- `excerptAm`: Amharic excerpt/description
- `content`: English content (HTML format)
- `contentAm`: Amharic content (HTML format)
- `author`: Author name
- `category`: Post category (e.g., "moving-tips", "packing-guide")
- `tags`: Array of English tags
- `tagsAm`: Array of Amharic tags
- `readTime`: Estimated reading time in minutes
- `featuredImage`: Main image URL
- `images`: Array of additional image URLs
- `status`: "published" or "draft"
- `publishedAt`: Publication date (ISO string)
- `slug`: URL-friendly slug (must be unique)

## Categories

Available categories:
- `moving-tips`: Moving Tips
- `packing-guide`: Packing Guide
- `storage-tips`: Storage Tips
- `company-news`: Company News

## Benefits

- **Easy Management**: No need to use the admin interface
- **Version Control**: JSON files can be version controlled
- **Bulk Operations**: Easy to create multiple posts at once
- **Backup**: Simple backup and restore process
- **Flexibility**: Can be edited with any text editor

## Notes

- The system automatically combines posts from both database and JSON files
- Posts are sorted by publication date (newest first)
- Duplicate slugs are handled gracefully
- All posts support both English and Amharic content
- HTML content is supported in the content fields
