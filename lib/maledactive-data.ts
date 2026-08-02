import { Building2, Package, Truck, Warehouse } from 'lucide-react'

export const MALED_SERVICES = [
  {
    id: 'local-moving',
    title: 'Local Moving',
    description:
      'Door-to-door residential moves across Addis Ababa with careful handling, loading, and placement at your new home.',
    icon: Truck,
    features: [
      'Professional packing support',
      'Furniture disassembly & assembly',
      'Same-day options available',
      'Trained moving crew',
    ],
  },
  {
    id: 'packaging',
    title: 'Packing Services',
    description:
      'Full packing solutions with quality materials to protect fragile items, electronics, and household goods.',
    icon: Package,
    features: [
      'Premium packing materials',
      'Fragile item protection',
      'Labelled box inventory',
      'Unpacking assistance',
    ],
  },
  {
    id: 'office-relocation',
    title: 'Office Relocation',
    description:
      'Efficient commercial moves with minimal downtime — desks, IT equipment, and documents handled with care.',
    icon: Building2,
    features: [
      'After-hours scheduling',
      'Equipment-safe handling',
      'Coordinated team workflow',
      'Minimal business disruption',
    ],
  },
  {
    id: 'storage',
    title: 'Storage Solutions',
    description:
      'Secure short and long-term storage when you need flexibility between move-out and move-in dates.',
    icon: Warehouse,
    features: [
      'Clean secure facilities',
      'Flexible rental terms',
      'Easy access scheduling',
      'Inventory tracking',
    ],
  },
] as const

export const MALED_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Request a Quote',
    description: 'Call, WhatsApp, or send us your move details for a fast estimate.',
  },
  {
    step: '02',
    title: 'Plan Your Move',
    description: 'We confirm date, crew size, packing needs, and access logistics.',
  },
  {
    step: '03',
    title: 'Pack & Load',
    description: 'Our team protects, packs, and loads everything with care.',
  },
  {
    step: '04',
    title: 'Deliver & Settle In',
    description: 'We transport, unload, and place items where you need them.',
  },
] as const

export const MALED_STATS = [
  { value: 500, suffix: '+', label: 'Moves Completed' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: '/7', label: 'Support Available' },
] as const

export const MALED_TESTIMONIALS = [
  {
    id: '1',
    name: 'Daniel T.',
    service: 'Local Moving',
    quote:
      'Maled Active handled our apartment move flawlessly. Professional crew, on time, and nothing was damaged.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Hanna M.',
    service: 'Packing Services',
    quote:
      'They packed our entire kitchen and fragile items perfectly. Moving day was stress-free because of their preparation.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Samuel K.',
    service: 'Office Relocation',
    quote:
      'Our office relocation happened over the weekend. We were operational Monday morning without issues.',
    rating: 5,
  },
] as const

export const MALED_VALUES = [
  {
    title: 'Reliability',
    description: 'We show up on time and deliver what we promise — every move, every client.',
  },
  {
    title: 'Care',
    description: 'Your belongings are treated with the same respect we would give our own.',
  },
  {
    title: 'Transparency',
    description: 'Clear quotes, honest timelines, and no surprise fees.',
  },
] as const
