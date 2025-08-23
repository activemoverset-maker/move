import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Active Movers & Packers - Terms of Service | Moving Service Terms & Conditions',
  description: 'Read Active Movers & Packers terms of service. Understand our moving service terms, conditions, liability, and customer responsibilities in Addis Ababa.',
  openGraph: {
    title: 'Active Movers & Packers - Terms of Service | Moving Service Terms & Conditions',
    description: 'Our terms and conditions for professional moving services in Addis Ababa, Ethiopia.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By using Active Movers & Packers services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services</h2>
              <p className="text-gray-700 mb-4">
                Active Movers & Packers provides professional moving, packing, and storage services in Addis Ababa and surrounding areas. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Local residential and commercial moving</li>
                <li>Professional packing and unpacking</li>
                <li>Office relocation services</li>
                <li>Storage solutions</li>
                <li>Furniture assembly and disassembly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Booking and Payment</h2>
              <p className="text-gray-700 mb-4">
                All bookings require confirmation and may require a deposit. Payment terms will be specified in your service agreement. We accept cash, bank transfers, and approved payment methods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Customer Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Customers are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing accurate information about items to be moved</li>
                <li>Preparing items for moving as instructed</li>
                <li>Being present or having an authorized representative during service</li>
                <li>Ensuring safe access to both pickup and delivery locations</li>
                <li>Declaring valuable or fragile items in advance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Liability and Insurance</h2>
              <p className="text-gray-700 mb-4">
                Active Movers & Packers is fully insured and takes utmost care in handling your belongings. 
                Our liability for damage or loss is limited to the terms specified in your service agreement. 
                We recommend customers maintain their own insurance for high-value items.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancellations must be made at least 24 hours in advance to avoid charges. 
                Same-day cancellations may incur fees as specified in your service agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Items</h2>
              <p className="text-gray-700 mb-4">
                We cannot transport hazardous materials, illegal items, perishable goods, or items of extraordinary value without prior arrangement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes will be resolved through good faith negotiation. If necessary, disputes will be handled according to Ethiopian law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these terms or our services:
              </p>
              <ul className="list-none text-gray-700">
                <li>Email: activemoverset@gmail.com</li>
                <li>Phone: +251982260000</li>
                <li>Address: Beka Building, Addis Ababa, Ethiopia</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
