import { generateSitemap, generateSitemapXML, generateRobotsTxt } from '@/lib/sitemap-generator'
import fs from 'fs/promises'
import path from 'path'

export class SitemapManager {
  private static sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  private static robotsPath = path.join(process.cwd(), 'public', 'robots.txt')

  /**
   * Update the sitemap with current blog posts and static pages
   */
  static async updateSitemap(): Promise<{ success: boolean; message: string }> {
    try {
      const sitemapData = generateSitemap()
      const xml = generateSitemapXML(sitemapData)
      
      await fs.writeFile(this.sitemapPath, xml, 'utf-8')
      
      return {
        success: true,
        message: `Sitemap updated successfully with ${sitemapData.urls.length} URLs`
      }
    } catch (error) {
      console.error('Error updating sitemap:', error)
      return {
        success: false,
        message: 'Failed to update sitemap'
      }
    }
  }

  /**
   * Update the robots.txt file
   */
  static async updateRobotsTxt(): Promise<{ success: boolean; message: string }> {
    try {
      const robotsTxt = generateRobotsTxt()
      await fs.writeFile(this.robotsPath, robotsTxt, 'utf-8')
      
      return {
        success: true,
        message: 'Robots.txt updated successfully'
      }
    } catch (error) {
      console.error('Error updating robots.txt:', error)
      return {
        success: false,
        message: 'Failed to update robots.txt'
      }
    }
  }

  /**
   * Get current sitemap statistics
   */
  static async getSitemapStats(): Promise<{
    totalUrls: number
    lastUpdated: string
    blogPosts: number
    staticPages: number
  }> {
    try {
      const sitemapData = generateSitemap()
      const blogPosts = sitemapData.urls.filter(url => url.loc.includes('/blog/')).length
      const staticPages = sitemapData.urls.length - blogPosts

      return {
        totalUrls: sitemapData.urls.length,
        lastUpdated: sitemapData.lastUpdated,
        blogPosts,
        staticPages
      }
    } catch (error) {
      console.error('Error getting sitemap stats:', error)
      return {
        totalUrls: 0,
        lastUpdated: new Date().toISOString(),
        blogPosts: 0,
        staticPages: 0
      }
    }
  }

  /**
   * Validate sitemap structure
   */
  static async validateSitemap(): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const sitemapData = generateSitemap()
      
      // Check for required URLs
      const requiredUrls = ['/', '/about', '/services', '/contact', '/blog']
      const existingUrls = sitemapData.urls.map(url => new URL(url.loc).pathname)
      
      requiredUrls.forEach(url => {
        if (!existingUrls.includes(url)) {
          errors.push(`Missing required URL: ${url}`)
        }
      })

      // Check for blog posts
      const blogUrls = sitemapData.urls.filter(url => url.loc.includes('/blog/'))
      if (blogUrls.length === 0) {
        warnings.push('No blog posts found in sitemap')
      }

      // Check for duplicate URLs
      const urlCounts = sitemapData.urls.reduce((acc, url) => {
        acc[url.loc] = (acc[url.loc] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      Object.entries(urlCounts).forEach(([url, count]) => {
        if (count > 1) {
          errors.push(`Duplicate URL found: ${url} (${count} times)`)
        }
      })

      // Check for valid priorities
      sitemapData.urls.forEach(url => {
        if (url.priority < 0 || url.priority > 1) {
          errors.push(`Invalid priority for ${url.loc}: ${url.priority}`)
        }
      })

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate sitemap'],
        warnings: []
      }
    }
  }

  /**
   * Force refresh both sitemap and robots.txt
   */
  static async forceRefresh(): Promise<{
    sitemap: { success: boolean; message: string }
    robots: { success: boolean; message: string }
  }> {
    const sitemapResult = await this.updateSitemap()
    const robotsResult = await this.updateRobotsTxt()

    return {
      sitemap: sitemapResult,
      robots: robotsResult
    }
  }
}
