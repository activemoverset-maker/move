import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Home,
  Layers,
  PackageOpen,
  Sofa,
  Warehouse,
  MapPinned,
  Boxes,
  ArrowDownToLine,
} from 'lucide-react'

/**
 * Imagery — verified `images.unsplash.com` URLs from each photo’s Unsplash page (May 2026).
 * Hero: unsplash.com/photos/85I50YHCZok — moving truck, people unloading furniture outdoors.
 * CTA bg: unsplash.com/photos/GK8x_XCcDZg — large warehouse interior.
 * Gallery order matches Unsplash slugs documented inline below.
 */
export const ADDIS_PREMIUM_IMAGES = {
  hero:
    'https://images.unsplash.com/photo-1776885008664-68b2988373e6?auto=format&fit=crop&q=85&w=2400',
  cta:
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=85&w=2400',
  gallery: [
    // unsplash.com/photos/ctXcNX1b4Oo — loading boxes into moving truck
    'https://images.unsplash.com/photo-1715645948484-da40dd56bc93?auto=format&fit=crop&q=85&w=1600',
    // unsplash.com/photos/rEqEQK_DFJE — unloading furniture from truck
    'https://images.unsplash.com/photo-1698917414969-feade59e3343?auto=format&fit=crop&q=85&w=1600',
    // unsplash.com/photos/x6pnKtPZ-8s — professional moving truck & crew context
    'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=85&w=1600',
    // unsplash.com/photos/BNBA1h-NgdY — warehouse shelving, boxed inventory
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=85&w=1600',
    // unsplash.com/photos/sczNLg6rrhQ — warehouse crates / logistics staging
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=85&w=1600',
    // unsplash.com/photos/2zZp12ChxhU — office floor / workstation transition
    'https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&q=85&w=1600',
  ],
} as const

export type PremiumService = {
  title: string
  description: string
  icon: LucideIcon
}

export const ADDIS_PREMIUM_SERVICES: PremiumService[] = [
  {
    title: 'Home Moving',
    description: 'Full-home relocations with white-glove handling, floor protection, and coordinated crew leads.',
    icon: Home,
  },
  {
    title: 'Apartment Relocation',
    description: 'Elevator scheduling, tight-access navigation, and quiet-hour options for premium residences.',
    icon: Building2,
  },
  {
    title: 'Office Relocation',
    description: 'IT-sensitive moves, asset tagging, and phased transfers to keep your teams operational.',
    icon: Layers,
  },
  {
    title: 'Packing & Unpacking',
    description: 'Museum-grade materials, room-by-room labeling, and optional unpack-to-shelf service.',
    icon: PackageOpen,
  },
  {
    title: 'Furniture Transportation',
    description: 'Blanket wrapping, edge guarding, and load-secured transit for high-value pieces.',
    icon: Sofa,
  },
  {
    title: 'Loading & Unloading',
    description: 'Trained lift teams, equipment-first workflows, and real-time load documentation.',
    icon: ArrowDownToLine,
  },
  {
    title: 'Warehouse Moving',
    description: 'Palletized inventory, aisle mapping, and rapid redeployment across facilities.',
    icon: Warehouse,
  },
  {
    title: 'Long Distance Moving',
    description: 'Route-optimized convoys, sealed trailers, and milestone tracking from pickup to delivery.',
    icon: MapPinned,
  },
  {
    title: 'Commercial Relocation',
    description: 'Retail, hospitality, and light industrial moves with minimal downtime windows.',
    icon: Boxes,
  },
]

export const ADDIS_PREMIUM_PROCESS = [
  {
    step: '01',
    title: 'Request a Quote',
    body: 'Share inventory, access details, and timing — we respond with a clear scope and timeline.',
  },
  {
    step: '02',
    title: 'Schedule Your Move',
    body: 'Lock your crew, vehicles, and optional packing days with a single coordinated schedule.',
  },
  {
    step: '03',
    title: 'Packing & Preparation',
    body: 'Protective materials, disassembly where needed, and labeled zones for flawless unloading.',
  },
  {
    step: '04',
    title: 'Transportation & Logistics',
    body: 'GPS-tracked fleet, secured loads, and on-route updates so you always know the status.',
  },
  {
    step: '05',
    title: 'Safe Delivery & Setup',
    body: 'Placement to plan, debris removal, and optional reassembly — move-in ready on day one.',
  },
] as const

export const ADDIS_PREMIUM_STATS = [
  { label: 'Successful Moves', value: 500, suffix: '+' },
  { label: 'Happy Customers', value: 1000, suffix: '+' },
  { label: 'Customer Support', value: 24, suffix: '/7' },
  { label: 'Same-Day Availability', value: 100, suffix: '%' },
] as const

export const ADDIS_PREMIUM_TRUST_POINTS = [
  'Experienced moving professionals',
  'Modern, maintained fleet',
  'Safe handling guarantee',
  'Professional packing teams',
  'Transparent, competitive pricing',
  'Fast, reliable scheduling',
  'Addis Ababa local expertise',
] as const

export const ADDIS_PREMIUM_AREAS = [
  { name: 'Megenagna', script: 'መገናኛ', featured: true },
  { name: 'Bole', script: null, featured: false },
  { name: 'CMC', script: null, featured: false },
  { name: 'Piassa', script: null, featured: false },
  { name: 'Kazanchis', script: null, featured: false },
  { name: 'Gerji', script: null, featured: false },
  { name: 'Ayat', script: null, featured: false },
  { name: 'Lideta', script: null, featured: false },
  { name: 'Jemo', script: null, featured: false },
  { name: 'Summit', script: null, featured: false },
  { name: 'Sarbet', script: null, featured: false },
] as const

export const ADDIS_PREMIUM_TESTIMONIALS = [
  {
    name: 'Yohannes Tekle',
    role: 'Office Manager',
    quote:
      'Professional crew, reliable scheduling, and zero damage to our workstations. The relocation felt orchestrated, not chaotic.',
    rating: 5,
  },
  {
    name: 'Marta Haile',
    role: 'Homeowner',
    quote:
      'They wrapped every piece like it belonged in a gallery. Fast service, affordable pricing, and genuinely stress-free.',
    rating: 5,
  },
  {
    name: 'Rajesh Patel',
    role: 'Operations Lead',
    quote:
      'Fragile inventory was handled with precision. Clear communication from quote to unload — exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Samson Alemu',
    role: 'Resident',
    quote:
      'Same-day coordination saved us. Movers were uniformed, punctual, and careful with our floors and furniture.',
    rating: 5,
  },
] as const

export const ADDIS_HERO_TRUST_CHIPS = [
  'Same-Day Moving',
  'Professional Crew',
  'Safe Furniture Handling',
  'Affordable Pricing',
  'Insured Transport',
] as const

export const ADDIS_FLOATING_STATUS = {
  route: 'Ring Road → Megenagna',
  eta: 'On schedule',
  load: 'Crew Alpha',
} as const
