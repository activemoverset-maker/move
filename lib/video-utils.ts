export interface VideoEmbed {
  type: 'youtube' | 'tiktok' | 'vimeo' | 'custom'
  url: string
  title: string
  description?: string
  thumbnail?: string
  embedCode?: string
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

export function extractTikTokVideoId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[^\/]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/([^\/\?]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

export function generateYouTubeEmbed(videoId: string, title: string): string {
  return `
    <div class="video-container my-6">
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/${videoId}"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="rounded-lg shadow-lg"
      ></iframe>
    </div>
  `
}

export function generateTikTokEmbed(videoId: string, title: string): string {
  return `
    <div class="video-container my-6">
      <blockquote
        class="tiktok-embed"
        cite="https://www.tiktok.com/@activemovers/video/${videoId}"
        data-video-id="${videoId}"
      >
        <section>
          <a target="_blank" href="https://www.tiktok.com/@activemovers">@activemovers</a>
        </section>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>
    </div>
  `
}

export function generateCustomEmbed(embedCode: string): string {
  return `
    <div class="video-container my-6">
      ${embedCode}
    </div>
  `
}

export function processVideoEmbed(video: VideoEmbed): string {
  switch (video.type) {
    case 'youtube':
      const youtubeId = extractYouTubeVideoId(video.url)
      if (youtubeId) {
        return generateYouTubeEmbed(youtubeId, video.title)
      }
      break
      
    case 'tiktok':
      const tiktokId = extractTikTokVideoId(video.url)
      if (tiktokId) {
        return generateTikTokEmbed(tiktokId, video.title)
      }
      break
      
    case 'custom':
      if (video.embedCode) {
        return generateCustomEmbed(video.embedCode)
      }
      break
  }
  
  // Fallback to simple link
  return `
    <div class="video-container my-6">
      <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
        ${video.title}
      </a>
    </div>
  `
} 
 
 
 