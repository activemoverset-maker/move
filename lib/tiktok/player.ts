export interface TikTokPlayerOptions {
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  description?: boolean
  musicInfo?: boolean
  rel?: boolean
  loop?: boolean
}

export function buildTikTokPlayerSrc(
  videoId: string,
  options: TikTokPlayerOptions = {}
): string {
  const {
    autoplay = true,
    muted = false,
    controls = true,
    description = false,
    musicInfo = false,
    rel = false,
    loop = false,
  } = options

  const params = new URLSearchParams({
    controls: controls ? '1' : '0',
    progress_bar: controls ? '1' : '0',
    play_button: controls ? '1' : '0',
    volume_control: '1',
    fullscreen_button: '1',
    timestamp: '1',
    loop: loop ? '1' : '0',
    autoplay: autoplay ? '1' : '0',
    muted: muted ? '1' : '0',
    music_info: musicInfo ? '1' : '0',
    description: description ? '1' : '0',
    rel: rel ? '1' : '0',
    closed_caption: '1',
  })

  return `https://www.tiktok.com/player/v1/${videoId}?${params.toString()}`
}

export function postToTikTokPlayer(
  iframe: HTMLIFrameElement,
  type: string,
  value?: unknown
): void {
  iframe.contentWindow?.postMessage(
    { 'x-tiktok-player': true, type, value },
    '*'
  )
}
