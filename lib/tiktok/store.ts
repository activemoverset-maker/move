import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { TikTokVideoRecord } from '@/lib/tiktok/types'

const DATA_DIR = path.join(process.cwd(), 'data', 'tiktok')
const DATA_FILE = path.join(DATA_DIR, 'videos.json')

function ensureStore(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]\n', 'utf8')
  }
}

export function readTikTokVideos(): TikTokVideoRecord[] {
  ensureStore()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as TikTokVideoRecord[]) : []
  } catch (error) {
    console.error('readTikTokVideos failed:', error)
    return []
  }
}

export function writeTikTokVideos(videos: TikTokVideoRecord[]): void {
  ensureStore()
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(videos, null, 2)}\n`, 'utf8')
}

export function sortTikTokVideos(videos: TikTokVideoRecord[]): TikTokVideoRecord[] {
  return [...videos].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    if (a.order !== b.order) return a.order - b.order
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function createTikTokId(): string {
  return randomUUID()
}

export function getTikTokDataPath(): string {
  return DATA_FILE
}
