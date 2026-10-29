import { Metadata } from 'next'
import { AddGuideForm } from '@/components/admin/add-guide-form'

export const metadata: Metadata = {
  title: 'Add Moving Guide | Active Movers Admin',
  description: 'Create a new moving guide JSON for the /guides section.',
}

export default function AddGuidePage() {
  return (
    <div className="pt-16">
      <AddGuideForm />
    </div>
  )
}
