'use client'

import React, { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children: ReactNode
}

export function Widget({ title, children }: HeaderProps) {
  return (
    <div className="border-b border-border/40 px-8 py-4 max-sm:h-1/6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold max-sm:hidden max-sm:text-xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}
