/**
 * Count index:true published posts (guides + blogs). Expect 48 after W0 tier policy.
 * Usage: node scripts/count-indexable-urls.mjs
 */
import fs from 'fs'
import path from 'path'

function countDir(dir) {
  let n = 0
  const slugs = []
  if (!fs.existsSync(dir)) return { n, slugs }
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    if (j.status === 'published' && j.index === true) {
      n++
      slugs.push(j.slug)
    }
  }
  return { n, slugs }
}

const guides = countDir(path.join(process.cwd(), 'data', 'guides'))
const blogs = countDir(path.join(process.cwd(), 'data', 'blogs'))
const total = guides.n + blogs.n

console.log('Indexable guides:', guides.n)
console.log('Indexable blogs:', blogs.n)
console.log('Total indexable JSON posts:', total)
if (total !== 48) {
  console.warn('Expected 48 per implementation plan tier — re-run fix-guide-blog-metadata.mjs if intentional drift.')
}
