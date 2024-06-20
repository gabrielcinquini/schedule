'use client'

import React, { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children: ReactNode
}

export function Widget({ title, children }: HeaderProps) {
  return (
    <div className="border-b border-border/40 max-sm:h-1/6 max-sm:px-4 max-sm:py-2 md:px-12 md:py-8 lg:px-32 lg:py-6">
      <div className="flex justify-between sm:container">
        <h1 className="text-3xl font-bold max-sm:hidden max-sm:text-xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}
