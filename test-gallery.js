// Simple test to verify gallery utilities work
const { getRandomizedGalleryImages } = require('./lib/gallery-utils.ts')

try {
  const images = getRandomizedGalleryImages()
  console.log('Gallery images loaded successfully:', images.length)
  console.log('First image:', images[0])
} catch (error) {
  console.error('Error loading gallery images:', error)
}
