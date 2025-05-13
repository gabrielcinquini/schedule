import { ReactNode } from 'react'

import ModeToggle from '@/components/ui/mode-toggle'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <ModeToggle />
      </div>
      {children}
    </>
  )
}
