'use client'

import React from 'react'

import CardInfo from '@/components/CardInfo'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ModeToggle from '@/components/ui/mode-toggle'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/hooks/Schedule/useSchedules'
import { calcularTotal } from '@/utils/utils'

import { CreateScheduleForm } from './CreateScheduleForm'

export function HeaderSchedule() {
  const { data: schedules, isLoading } = useSchedules('PENDING')

  return (
    <header className="border-b border-border/40 max-sm:h-1/6 max-sm:px-4 max-sm:py-2 md:px-12 md:py-8 lg:px-32 lg:py-6">
      <div className="container flex justify-between gap-4">
        <h1 className="text-end text-3xl font-bold max-sm:text-xl">Agenda</h1>
        {isLoading ? (
          <Skeleton className="h-32 w-1/5" />
        ) : (
          <CardInfo
            currentPage="schedule"
            totalHome={calcularTotal(schedules)}
          />
        )}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Agendar paciente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agendar paciente</DialogTitle>
                <DialogDescription>
                  Preencha os campos com os dados para o agendamento.
                </DialogDescription>
              </DialogHeader>
              <CreateScheduleForm />
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
