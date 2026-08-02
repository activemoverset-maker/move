import { MaledLegalPage } from '@/components/maledactive/pages/maled-legal-page'
import { MALED_SITE } from '@/lib/maledactive-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  alternates: { canonical: '/terms-of-service' },
}

export default function Page() {
  return (
    <MaledLegalPage title="Terms of Service">
      <p>
        By using the website and services of {MALED_SITE.name}, you agree to the following terms. Please
        read them carefully before booking a move.
      </p>
      <h2>Services</h2>
      <p>
        We provide moving, packing, storage, and related logistics services. Quotes are estimates based on
        information provided and may be adjusted after an on-site assessment if required.
      </p>
      <h2>Booking & payment</h2>
      <p>
        A confirmed booking may require a deposit. Payment terms will be communicated at the time of
        booking. Cancellations should be made as early as possible to avoid fees.
      </p>
      <h2>Liability</h2>
      <p>
        We handle belongings with professional care. Liability for loss or damage is subject to the terms
        agreed upon in your service contract and applicable insurance coverage.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us at {MALED_SITE.contact.email} or {MALED_SITE.contact.phoneDisplay}.
      </p>
    </MaledLegalPage>
  )
}
