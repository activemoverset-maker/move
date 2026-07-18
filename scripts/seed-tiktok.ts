/**
 * Seed data/tiktok/videos.json from a list of @activemoverset video URLs.
 * Usage: npx tsx scripts/seed-tiktok.ts
 */

import { SOCIAL } from '../lib/social'
import { fetchTikTokOEmbed } from '../lib/tiktok/oembed'
import { extractTikTokVideoId } from '../lib/tiktok/parse'
import { writeTikTokVideos } from '../lib/tiktok/store'
import type { TikTokVideoRecord } from '../lib/tiktok/types'
import { randomUUID } from 'crypto'

const URLS = [
  'https://www.tiktok.com/@activemoverset/video/7592133459330501900',
  'https://www.tiktok.com/@activemoverset/video/7590447286958689592',
  'https://www.tiktok.com/@activemoverset/video/7589325891998600504',
  'https://www.tiktok.com/@activemoverset/video/7587490050561101067',
  'https://www.tiktok.com/@activemoverset/video/7585238167993732364',
  'https://www.tiktok.com/@activemoverset/video/7584158696029162808',
  'https://www.tiktok.com/@activemoverset/video/7583378381853510968',
  'https://www.tiktok.com/@activemoverset/video/7599318631398247687',
  'https://www.tiktok.com/@activemoverset/video/7598576625789193480',
  'https://www.tiktok.com/@activemoverset/video/7597120002310851852',
  'https://www.tiktok.com/@activemoverset/video/7594554146775207179',
  'https://www.tiktok.com/@activemoverset/video/7593819946447113484',
  'https://www.tiktok.com/@activemoverset/video/7593716175461190968',
  'https://www.tiktok.com/@activemoverset/video/7606368177529834773',
  'https://www.tiktok.com/@activemoverset/video/7605222736524332309',
  'https://www.tiktok.com/@activemoverset/video/7603408988608253204',
  'https://www.tiktok.com/@activemoverset/video/7603040663457844501',
  'https://www.tiktok.com/@activemoverset/video/7600703407279705365',
  'https://www.tiktok.com/@activemoverset/video/7612614864929885461',
  'https://www.tiktok.com/@activemoverset/video/7610293763100970261',
  'https://www.tiktok.com/@activemoverset/video/7609560242115890452',
  'https://www.tiktok.com/@activemoverset/video/7608235182948240660',
  'https://www.tiktok.com/@activemoverset/video/7607321578526756116',
  'https://www.tiktok.com/@activemoverset/video/7615933196433214741',
  'https://www.tiktok.com/@activemoverset/video/7615250097122659605',
  'https://www.tiktok.com/@activemoverset/video/7613686546868210964',
  'https://www.tiktok.com/@activemoverset/video/7613375193158864149',
  'https://www.tiktok.com/@activemoverset/video/7621198803814731029',
  'https://www.tiktok.com/@activemoverset/video/7620339605401029908',
  'https://www.tiktok.com/@activemoverset/video/7619548737119030548',
  'https://www.tiktok.com/@activemoverset/video/7619257256374193428',
  'https://www.tiktok.com/@activemoverset/video/7618449823116823828',
  'https://www.tiktok.com/@activemoverset/video/7617447278298615061',
  'https://www.tiktok.com/@activemoverset/video/7616711693866994965',
  'https://www.tiktok.com/@activemoverset/video/7626030166678015252',
  'https://www.tiktok.com/@activemoverset/video/7625242260090752277',
  'https://www.tiktok.com/@activemoverset/video/7624843860170001672',
  'https://www.tiktok.com/@activemoverset/video/7624512356835478804',
  'https://www.tiktok.com/@activemoverset/video/7624135873029803285',
  'https://www.tiktok.com/@activemoverset/video/7623739349842005268',
  'https://www.tiktok.com/@activemoverset/video/7622988856530439445',
  'https://www.tiktok.com/@activemoverset/video/7622314061816089876',
  'https://www.tiktok.com/@activemoverset/video/7629373020976483604',
  'https://www.tiktok.com/@activemoverset/video/7628923389180169492',
  'https://www.tiktok.com/@activemoverset/video/7628649394535189780',
  'https://www.tiktok.com/@activemoverset/video/7628211521910295828',
  'https://www.tiktok.com/@activemoverset/video/7627434602235186452',
  'https://www.tiktok.com/@activemoverset/video/7626746533676895509',
  'https://www.tiktok.com/@activemoverset/video/7626430927165525268',
  'https://www.tiktok.com/@activemoverset/video/7635337101533302036',
  'https://www.tiktok.com/@activemoverset/video/7634189071065173268',
  'https://www.tiktok.com/@activemoverset/video/7633420797872295189',
  'https://www.tiktok.com/@activemoverset/video/7633103628525489428',
  'https://www.tiktok.com/@activemoverset/video/7632731794885987605',
  'https://www.tiktok.com/@activemoverset/video/7632329506061045013',
  'https://www.tiktok.com/@activemoverset/video/7631988220858944789',
  'https://www.tiktok.com/@activemoverset/video/7641348509651733780',
  'https://www.tiktok.com/@activemoverset/video/7640933029199858964',
  'https://www.tiktok.com/@activemoverset/video/7640161760158207252',
  'https://www.tiktok.com/@activemoverset/video/7639739804506131732',
  'https://www.tiktok.com/@activemoverset/video/7639042085554851092',
  'https://www.tiktok.com/@activemoverset/video/7638631736095542548',
  'https://www.tiktok.com/@activemoverset/video/7637875781711973653',
  'https://www.tiktok.com/@activemoverset/video/7637205913333681428',
  'https://www.tiktok.com/@activemoverset/video/7636439636629343508',
  'https://www.tiktok.com/@activemoverset/video/7644273938658266389',
  'https://www.tiktok.com/@activemoverset/video/7643870399255596309',
  'https://www.tiktok.com/@activemoverset/video/7643535521708281108',
  'https://www.tiktok.com/@activemoverset/video/7642758384722234644',
  'https://www.tiktok.com/@activemoverset/video/7642037396011273492',
  'https://www.tiktok.com/@activemoverset/video/7641882070381366548',
  'https://www.tiktok.com/@activemoverset/video/7650949740968054023',
  'https://www.tiktok.com/@activemoverset/video/7645962969741921557',
  'https://www.tiktok.com/@activemoverset/video/7645330778703875348',
  'https://www.tiktok.com/@activemoverset/video/7644874117157506312',
  'https://www.tiktok.com/@activemoverset/video/7644618968417750292',
  'https://www.tiktok.com/@activemoverset/video/7657188231993117959',
  'https://www.tiktok.com/@activemoverset/video/7656116672478104839',
  'https://www.tiktok.com/@activemoverset/video/7655639974716394759',
  'https://www.tiktok.com/@activemoverset/video/7655230051050425608',
  'https://www.tiktok.com/@activemoverset/video/7655024838070848776',
  'https://www.tiktok.com/@activemoverset/video/7654237358526696711',
  'https://www.tiktok.com/@activemoverset/video/7653844333648563463',
  'https://www.tiktok.com/@activemoverset/video/7652761230012206354',
  'https://www.tiktok.com/@activemoverset/video/7652260044540595474',
  'https://www.tiktok.com/@activemoverset/video/7651624920371449096',
  'https://www.tiktok.com/@activemoverset/video/7662028542984736007',
  'https://www.tiktok.com/@activemoverset/video/7661541546919202066',
  'https://www.tiktok.com/@activemoverset/video/7660864125068725512',
  'https://www.tiktok.com/@activemoverset/video/7660523072478366984',
  'https://www.tiktok.com/@activemoverset/video/7659796122394840327',
  'https://www.tiktok.com/@activemoverset/video/7659102642009902344',
  'https://www.tiktok.com/@activemoverset/video/7658278696477805842',
  'https://www.tiktok.com/@activemoverset/video/7663520159109238024',
  'https://www.tiktok.com/@activemoverset/video/7658674036209175826',
  'https://www.tiktok.com/@activemoverset/video/7594864769870417208',
  'https://www.tiktok.com/@activemoverset/video/7663108451379219730',
  'https://www.tiktok.com/@activemoverset/video/7662304911480147218',
]

const FEATURED_COUNT = 6
const DELAY_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const videos: TikTokVideoRecord[] = []
  const seen = new Set<string>()
  let ok = 0
  let fail = 0

  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i]
    const videoId = extractTikTokVideoId(url)
    if (!videoId || seen.has(videoId)) continue
    seen.add(videoId)

    const now = new Date().toISOString()
    let title = `Active Movers ET — Video ${videoId.slice(-6)}`
    let thumbnailUrl: string | null = null
    let thumbnailWidth: number | null = null
    let thumbnailHeight: number | null = null
    let authorName: string | null = SOCIAL.tiktok.displayName
    let authorUrl: string | null = SOCIAL.tiktok.profileUrl
    let healthStatus: TikTokVideoRecord['healthStatus'] = 'ok'

    try {
      const oembed = await fetchTikTokOEmbed(url)
      title = oembed.title
      thumbnailUrl = oembed.thumbnail_url ?? null
      thumbnailWidth = oembed.thumbnail_width ?? null
      thumbnailHeight = oembed.thumbnail_height ?? null
      authorName = oembed.author_name
      authorUrl = oembed.author_url
      ok++
      process.stdout.write(`✓ [${i + 1}/${URLS.length}] ${videoId}\n`)
    } catch (err) {
      healthStatus = 'error'
      fail++
      process.stdout.write(`✗ [${i + 1}/${URLS.length}] ${videoId}\n`)
    }

    videos.push({
      id: randomUUID(),
      videoId,
      url,
      title,
      titleAm: null,
      description: null,
      descriptionAm: null,
      authorName,
      authorUrl,
      thumbnailUrl,
      thumbnailWidth,
      thumbnailHeight,
      username: SOCIAL.tiktok.username,
      category: 'moves',
      isFeatured: i < FEATURED_COUNT,
      isPinned: false,
      isActive: true,
      healthStatus,
      lastOembedAt: now,
      order: i,
      viewCountLocal: 0,
      shareCountLocal: 0,
      source: 'seed',
      createdAt: now,
      updatedAt: now,
    })

    if (i < URLS.length - 1) await sleep(DELAY_MS)
  }

  writeTikTokVideos(videos)
  console.log(`\nDone: ${videos.length} videos (${ok} oEmbed ok, ${fail} fallback)`)
  console.log(`Featured on homepage: first ${FEATURED_COUNT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
