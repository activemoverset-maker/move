'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function MaledAmbientLayer() {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
        <div className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute -right-[15%] bottom-[5%] h-[65vmin] w-[65vmin] rounded-full bg-sky-500/10 blur-[100px]" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-amber-500/15 blur-[110px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.06, 1], x: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[5%] h-[65vmin] w-[65vmin] rounded-full bg-sky-400/12 blur-[110px]"
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.02, 1, 1.05], x: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[50vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-amber-600/8 blur-[130px]"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  )
}
