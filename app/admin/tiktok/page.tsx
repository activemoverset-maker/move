import { Metadata } from 'next'
import { TikTokManagement } from '@/components/admin/tiktok-management'

export const metadata: Metadata = {
  title: 'TikTok Feed Management | Active Movers Admin',
  description: 'Manage @activemoverset TikTok videos for the website feed.',
}

export default function AdminTikTokPage() {
  return (
    <div className="pt-16">
      <TikTokManagement />
    </div>
  )
}
