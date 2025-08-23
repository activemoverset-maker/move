import { Metadata } from 'next'
import { GalleryManagement } from '../../../components/admin/gallery-management'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Gallery Management | Photo & Content Management',
  description: 'Manage gallery images and content for Active Movers & Packers. Upload, organize, and showcase moving services and company photos.',
}

export default function AdminGalleryPage() {
  return (
    <div className="pt-16">
      <GalleryManagement />
    </div>
  )
}
