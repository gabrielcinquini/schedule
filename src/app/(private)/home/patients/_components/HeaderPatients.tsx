'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ModeToggle from '@/components/ui/mode-toggle'

import { Button } from '../../../../../components/ui/button'
import { RegisterPatientForm } from './RegisterPatientForm'

export function HeaderPatients() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 p-12 backdrop-blur">
      <div className="container flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold max-sm:text-xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Cadastrar paciente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar paciente</DialogTitle>
                <DialogDescription>
                  Preencha os campos com os dados do paciente.
                </DialogDescription>
              </DialogHeader>
              <RegisterPatientForm />
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
