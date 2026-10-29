import { SiteChrome } from '@/components/site-chrome'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
