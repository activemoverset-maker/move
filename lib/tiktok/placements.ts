/**
 * Curated @activemoverset videos per page — each placement uses different clips
 * so the same videos are not repeated everywhere on the site.
 */

export type TikTokPlacement =
  | 'services-overview'
  | 'service-local-moving'
  | 'service-packaging'
  | 'service-storage'
  | 'service-office-relocation'
  | 'about'
  | 'bole-bulbula'
  | 'contact'
  | 'booking'
  | 'blog'
  | 'addis-active-movers'

export interface TikTokPlacementMeta {
  videoIds: string[]
  titleEn: string
  titleAm: string
  subtitleEn: string
  subtitleAm: string
  layout: 'grid' | 'strip'
}

export const TIKTOK_PLACEMENTS: Record<TikTokPlacement, TikTokPlacementMeta> = {
  'services-overview': {
    videoIds: [
      '7599318631398247687',
      '7598576625789193480',
      '7597120002310851852',
      '7594554146775207179',
    ],
    titleEn: 'See our services in action',
    titleAm: 'አገልግሎቶቻችንን በስራ ላይ ይመልከቱ',
    subtitleEn: 'Real moves from @activemoverset across Addis Ababa.',
    subtitleAm: 'ከ @activemoverset እውነተኛ መጓጓዣዎች በአዲስ አበባ።',
    layout: 'grid',
  },
  'service-local-moving': {
    videoIds: [
      '7593819946447113484',
      '7593716175461190968',
      '7606368177529834773',
    ],
    titleEn: 'Local moves on TikTok',
    titleAm: 'አካባቢያዊ መጓጓዣ በቲክቶክ',
    subtitleEn: 'Watch how we handle home and apartment moves.',
    subtitleAm: 'ቤት እና አፓርትመንት መጓጓዣ እንዴት እንደምንሰጥ ይመልከቱ።',
    layout: 'strip',
  },
  'service-packaging': {
    videoIds: [
      '7605222736524332309',
      '7603408988608253204',
      '7603040663457844501',
    ],
    titleEn: 'Professional packing clips',
    titleAm: 'የሙያ መጠን ቪዲዮዎች',
    subtitleEn: 'Careful wrapping and packing from our crew.',
    subtitleAm: 'ከቡድናችን ትኩረት የተሰጠ መጠን እና ማሸግ።',
    layout: 'strip',
  },
  'service-storage': {
    videoIds: [
      '7600703407279705365',
      '7612614864929885461',
      '7610293763100970261',
    ],
    titleEn: 'Storage & handling',
    titleAm: 'መጠን እና አያያዝ',
    subtitleEn: 'How we protect and move your belongings safely.',
    subtitleAm: 'እቃዎችዎን በደህንነት እንዴት እንደምንጠብቅ እና እንደምንሰጥ።',
    layout: 'strip',
  },
  'service-office-relocation': {
    videoIds: [
      '7609560242115890452',
      '7608235182948240660',
      '7607321578526756116',
    ],
    titleEn: 'Office & commercial moves',
    titleAm: 'ቢሮ እና ንግድ መጓጓዣ',
    subtitleEn: 'Office relocations with minimal disruption.',
    subtitleAm: 'አነስተኛ ግፍ ያለው የቢሮ መጓጓዣ።',
    layout: 'strip',
  },
  about: {
    videoIds: [
      '7615933196433214741',
      '7615250097122659605',
      '7613686546868210964',
    ],
    titleEn: 'Meet the team behind the moves',
    titleAm: 'መጓጓዣዎችን ከሚያከናውኑ ቡድኑ ጋር ይገናኙ',
    subtitleEn: 'Follow @activemoverset for daily updates from our crew.',
    subtitleAm: 'ከቡድናችን ዕለታዊ ዝማኔዎች ለ @activemoverset ይከተሉን።',
    layout: 'grid',
  },
  'bole-bulbula': {
    videoIds: [
      '7613375193158864149',
      '7621198803814731029',
      '7620339605401029908',
    ],
    titleEn: 'Moves in & around Bole Bulbula',
    titleAm: 'በቦሌ ቡልቡላ እና አካባቢው መጓጓዣ',
    subtitleEn: 'See our team serving this neighborhood on TikTok.',
    subtitleAm: 'በዚህ አካባቢ የሚሰጠውን አገልግሎት በቲክቶክ ይመልከቱ።',
    layout: 'strip',
  },
  contact: {
    videoIds: ['7619548737119030548', '7619257256374193428'],
    titleEn: 'Still deciding? Watch us first',
    titleAm: 'አሁንም እየተገረገሩ ነው? መጀመሪያ ይመልከቱን',
    subtitleEn: 'Short clips from @activemoverset before you reach out.',
    subtitleAm: 'ከመገናኘትዎ በፊት ከ @activemoverset አጭር ቪዲዮዎች።',
    layout: 'strip',
  },
  booking: {
    videoIds: ['7618449823116823828', '7617447278298615061'],
    titleEn: 'What to expect when you book',
    titleAm: 'ሲያስያዙ ምን እንደሚጠበቅዎት',
    subtitleEn: 'A quick look at our process — then lock in your date.',
    subtitleAm: 'የሂደታችን አጭር እይታ — ከዚያ ቀንዎን ያረጋግጡ።',
    layout: 'strip',
  },
  blog: {
    videoIds: [
      '7616711693866994965',
      '7626030166678015252',
      '7625242260090752277',
    ],
    titleEn: 'Moving tips from our TikTok',
    titleAm: 'ከቲክቶክ የመጓጓዣ ምክሮች',
    subtitleEn: 'Short clips from @activemoverset to go with our guides.',
    subtitleAm: 'ከ @activemoverset አጭር ቪዲዮዎች ከመመሪያዎቻችን ጋር።',
    layout: 'strip',
  },
  'addis-active-movers': {
    videoIds: [
      '7624843860170001672',
      '7624512356835478804',
      '7624135873029803285',
      '7623739349842005268',
    ],
    titleEn: 'See us on TikTok',
    titleAm: 'በቲክቶክ ይመልከቱን',
    subtitleEn: 'Real moves from @activemoverset across Addis Ababa.',
    subtitleAm: 'ከ @activemoverset እውነተኛ መጓጓዣዎች በአዲስ አበባ።',
    layout: 'grid',
  },
}

export function isTikTokPlacement(value: string): value is TikTokPlacement {
  return value in TIKTOK_PLACEMENTS
}

export function getServicePlacement(serviceId: string): TikTokPlacement | null {
  const key = `service-${serviceId}` as TikTokPlacement
  return isTikTokPlacement(key) ? key : null
}
