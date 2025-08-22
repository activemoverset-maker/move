#!/usr/bin/env node

/**
 * Favicon Generation Script for ActiveMovers
 * 
 * This script helps you generate favicon files from your existing logo.
 * You'll need to run this manually or use an online favicon generator.
 * 
 * Instructions:
 * 1. Use an online favicon generator like favicon.io or realfavicongenerator.net
 * 2. Upload your logo file: public/images/logotr.png
 * 3. Download the generated favicon files
 * 4. Place them in the public/ directory
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 ActiveMovers Favicon Generation Helper');
console.log('==========================================');
console.log('');
console.log('Your logo file is located at: public/images/logotr.png');
console.log('');
console.log('To generate favicon files:');
console.log('1. Visit https://favicon.io/ or https://realfavicongenerator.net/');
console.log('2. Upload your logo file');
console.log('3. Download the generated favicon package');
console.log('4. Extract and place the files in the public/ directory');
console.log('');
console.log('Required favicon files:');
console.log('- favicon.ico (16x16, 32x32)');
console.log('- favicon-16x16.png');
console.log('- favicon-32x32.png');
console.log('- apple-touch-icon.png (180x180)');
console.log('- android-chrome-192x192.png');
console.log('- android-chrome-512x512.png');
console.log('');
console.log('The layout.tsx file already includes proper favicon references.');
console.log('Update the manifest.json file paths if you generate new icon files.');
console.log('');

// Check if logo exists
const logoPath = path.join(__dirname, '../public/images/logotr.png');
if (fs.existsSync(logoPath)) {
  console.log('✅ Logo file found at:', logoPath);
} else {
  console.log('❌ Logo file not found at:', logoPath);
  console.log('Please ensure the logo file exists before generating favicons.');
}



