import { plusJakartaSans } from '../fonts/fonts'
import type { ReactNode } from 'react'

export default function AddisActiveMoversLayout({ children }: { children: ReactNode }) {
  return <div className={`${plusJakartaSans.variable} ${plusJakartaSans.className} antialiased`}>{children}</div>
}
