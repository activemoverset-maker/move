import { Metadata } from 'next'
import { GalleryManagement } from '../../../components/admin/gallery-management'

export const metadata: Metadata = {
  title: 'Gallery Management - Active Movers & Packers',
  description: 'Admin gallery management for Active Movers & Packers.',
}

export default function AdminGalleryPage() {
  return (
    <div className="pt-16">
      <GalleryManagement />
    </div>
  )
}
