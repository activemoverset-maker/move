# Blog System Guide - Active Movers & Packers

## Overview

This blog system provides a complete solution for managing blog posts with rich media content, including images, YouTube videos, TikTok embeds, and custom video embeds. The system supports both English and Amharic languages.

## Features

### ✅ Core Features
- **Database Storage**: Blog posts stored in PostgreSQL via Prisma ORM
- **Rich Media Support**: Images, YouTube, TikTok, Vimeo, and custom video embeds
- **Bilingual Support**: Full English and Amharic content support
- **SEO Optimized**: Proper metadata, Open Graph tags, and structured data
- **Admin Interface**: Easy-to-use forms for content management
- **Search & Filter**: Advanced search and category filtering
- **Analytics Integration**: Tracks views, interactions, and performance
- **Responsive Design**: Mobile-first approach with beautiful animations

### 🎥 Video Platform Support
- **YouTube**: Automatic embed generation from URLs
- **TikTok**: Native TikTok embed support
- **Vimeo**: Vimeo video embedding
- **Custom Embeds**: Support for any custom embed code

### 🖼️ Image Support
- **Featured Images**: Main blog post image
- **Additional Images**: Multiple images per post
- **Responsive Images**: Optimized for all devices
- **Image Galleries**: Grid layout for multiple images

## Database Setup

### 1. Prisma Schema
The blog system uses the following database models:

```prisma
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  titleAm     String
  excerpt     String
  excerptAm   String
  content     String   @db.Text
  contentAm   String   @db.Text
  author      String
  publishedAt DateTime @default(now())
  readTime    Int      @default(5)
  category    String
  tags        String[]
  tagsAm      String[]
  slug        String   @unique
  featuredImage String?
  images      String[]
  videos      Video[]
  status      String   @default("draft")
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Video {
  id          String   @id @default(cuid())
  type        String   // "youtube", "tiktok", "vimeo", "custom"
  url         String
  title       String
  description String?
  thumbnail   String?
  embedCode   String?
  blogPostId  String
  blogPost    BlogPost @relation(fields: [blogPostId], references: [id], onDelete: Cascade)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio (optional)
npm run db:studio
```

## API Endpoints

### Blog Posts
- `GET /api/blog` - Get all published blog posts
- `POST /api/blog` - Create new blog post
- `GET /api/blog/[slug]` - Get individual blog post by slug

### Example API Usage

#### Create a Blog Post
```javascript
const response = await fetch('/api/blog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Essential Moving Tips',
    titleAm: 'የመጓጓዣ ምክሮች',
    excerpt: 'Learn essential moving tips...',
    excerptAm: 'የመጓጓዣ ምክሮችን ይወቁ...',
    content: '<h2>Planning Your Move</h2><p>...</p>',
    contentAm: '<h2>መጓጓዣዎን ማዘጋጀት</h2><p>...</p>',
    author: 'Active Movers Team',
    category: 'moving-tips',
    tags: ['Moving Tips', 'Planning'],
    tagsAm: ['የመጓጓዣ ምክሮች', 'ዕቅድ'],
    readTime: 5,
    featuredImage: 'https://example.com/featured.jpg',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    videos: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=VIDEO_ID',
        title: 'Moving Tips Video',
        description: 'Learn essential moving tips'
      },
      {
        type: 'tiktok',
        url: 'https://www.tiktok.com/@activemovers/video/TIKTOK_ID',
        title: 'TikTok Moving Tips',
        description: 'Quick moving tips on TikTok'
      }
    ],
    status: 'published'
  }),
})
```

## Video Embed Support

### YouTube Videos
```javascript
// Automatically extracts video ID from various YouTube URL formats:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://youtube.com/embed/VIDEO_ID

const video = {
  type: 'youtube',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Moving Tips Video',
  description: 'Essential moving tips and tricks'
}
```

### TikTok Videos
```javascript
// Supports TikTok video URLs:
// - https://www.tiktok.com/@username/video/VIDEO_ID
// - https://vm.tiktok.com/SHORT_CODE

const video = {
  type: 'tiktok',
  url: 'https://www.tiktok.com/@activemovers/video/1234567890123456789',
  title: 'TikTok Moving Tips',
  description: 'Quick moving tips on TikTok'
}
```

### Custom Embeds
```javascript
// For any custom embed code (Vimeo, custom players, etc.)

const video = {
  type: 'custom',
  url: 'https://vimeo.com/123456789',
  title: 'Custom Video',
  description: 'Custom video embed',
  embedCode: '<iframe src="https://player.vimeo.com/video/123456789" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
}
```

## Image Management

### Featured Images
```javascript
// Single featured image for the blog post
featuredImage: 'https://example.com/featured-image.jpg'
```

### Additional Images
```javascript
// Multiple images displayed in a gallery
images: [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]
```

## Admin Interface

### Access Admin Panel
- **Dashboard**: `/admin` - Overview and statistics
- **Add Blog**: `/admin/blog/add` - Create new blog posts
- **View Blogs**: `/blog` - Public blog listing

### Admin Features
- **Rich Form Interface**: Easy-to-use forms with validation
- **Media Management**: Add images and videos with preview
- **Bilingual Support**: Input fields for both English and Amharic
- **Tag Management**: Add/remove tags for both languages
- **Category Selection**: Choose from predefined categories
- **Status Management**: Draft, published, or archived posts
- **Real-time Preview**: See changes as you type

## Content Guidelines

### Blog Post Structure
1. **Title**: Clear, descriptive title in both languages
2. **Excerpt**: Brief summary (150-200 characters)
3. **Content**: Full article with HTML formatting
4. **Author**: Author name
5. **Category**: Choose from predefined categories
6. **Tags**: Relevant keywords for both languages
7. **Read Time**: Estimated reading time in minutes
8. **Media**: Featured image, additional images, videos

### HTML Content Formatting
```html
<h2>Section Title</h2>
<p>Paragraph content with <strong>bold text</strong> and <em>italic text</em>.</p>

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

<blockquote>
  Important quote or highlight
</blockquote>
```

### Categories
- `moving-tips` - Moving Tips (የመጓጓዣ ምክሮች)
- `packing-guide` - Packing Guide (የመጠን መመሪያ)
- `storage-tips` - Storage Tips (የመጠን ምክሮች)
- `company-news` - Company News (የኩባንያ ዜናዎች)

## SEO Optimization

### Metadata
- **Title**: Blog post title with site name
- **Description**: Blog excerpt
- **Open Graph**: Title, description, image, type
- **Twitter Card**: Optimized for social sharing

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Blog Post Title",
  "description": "Blog post excerpt",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2024-01-15T00:00:00Z",
  "image": "Featured image URL"
}
```

## Analytics Integration

### Tracked Events
- `blog_view` - When a blog post is viewed
- `blog_share` - When a blog post is shared
- `blog_search` - When users search blogs
- `blog_category_filter` - When users filter by category
- `admin_blog_added` - When admin adds new blog post

### View Counting
- Automatic view count increment on each visit
- Stored in database for analytics
- Displayed in blog post header

## Performance Optimization

### Image Optimization
- Next.js Image component for automatic optimization
- Responsive images with proper sizing
- Lazy loading for better performance

### Video Optimization
- Lazy loading for video embeds
- Responsive video containers
- Fallback links for unsupported platforms

### Database Optimization
- Indexed fields for fast queries
- Efficient relationships between models
- Pagination support for large datasets

## Troubleshooting

### Common Issues

1. **Prisma Client Not Generated**
   ```bash
   npm run db:generate
   ```

2. **Database Connection Issues**
   - Check `.env` file for `DATABASE_URL`
   - Ensure database is running
   - Verify connection string format

3. **Video Embed Not Working**
   - Check video URL format
   - Verify video platform is supported
   - Test embed code manually

4. **Images Not Loading**
   - Verify image URLs are accessible
   - Check Next.js image domains configuration
   - Ensure proper image format (jpg, png, webp)

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Optional: Image domains for Next.js
NEXT_PUBLIC_IMAGE_DOMAINS="example.com,images.unsplash.com"
```

## Future Enhancements

### Planned Features
- **Image Upload**: Direct file upload to cloud storage
- **Rich Text Editor**: WYSIWYG editor for content creation
- **Blog Comments**: Comment system for engagement
- **Email Newsletter**: Blog post email notifications
- **Social Sharing**: Enhanced social media integration
- **Blog Analytics**: Detailed analytics dashboard
- **SEO Tools**: Built-in SEO optimization tools
- **Multi-language**: Support for additional languages

### Technical Improvements
- **Caching**: Redis caching for better performance
- **CDN Integration**: Content delivery network for media
- **Search**: Full-text search with Elasticsearch
- **API Rate Limiting**: Protect API endpoints
- **Webhooks**: Notifications for content changes

## Support

For technical support or questions about the blog system:
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

This blog system provides a robust foundation for content management with rich media support, bilingual capabilities, and excellent user experience. 
 
 
 