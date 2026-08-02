import { MaledLegalPage } from '@/components/maledactive/pages/maled-legal-page'
import { MALED_SITE } from '@/lib/maledactive-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy-policy' },
}

export default function Page() {
  return (
    <MaledLegalPage title="Privacy Policy">
      <p>
        {MALED_SITE.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This policy
        explains how we collect, use, and protect your personal information when you visit our website or
        use our moving services.
      </p>
      <h2>Information we collect</h2>
      <p>
        We may collect your name, email address, phone number, and move details when you submit our contact
        form, call us, or communicate via WhatsApp.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your information to respond to inquiries, provide quotes, schedule moves, and improve our
        services. We do not sell your personal data to third parties.
      </p>
      <h2>Data security</h2>
      <p>
        We take reasonable measures to protect your information. However, no method of transmission over
        the internet is 100% secure.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy-related questions, contact us at {MALED_SITE.contact.email} or {MALED_SITE.contact.phoneDisplay}.
      </p>
    </MaledLegalPage>
  )
}
