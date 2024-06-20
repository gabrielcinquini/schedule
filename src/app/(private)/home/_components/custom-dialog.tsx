'use client'

import React, { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CustomDialogProps {
  triggerText: string
  title: string
  description: string
  children: ReactNode
}

export function CustomDialog({
  triggerText,
  title,
  description,
  children,
}: CustomDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-sm:text-sm">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
