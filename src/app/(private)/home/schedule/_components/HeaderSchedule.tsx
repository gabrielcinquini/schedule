'use client'

import React from 'react'

import CardInfo from '@/components/CardInfo'
import { CustomDialog } from '@/components/CustomDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Widget } from '@/components/Widget'
import { useSchedules } from '@/hooks/Schedule/useSchedules'
import { APP_ROUTES } from '@/routes/paths'
import { calcularTotal } from '@/utils/utils'

import { CreateScheduleForm } from './CreateScheduleForm'

export function HeaderSchedule() {
  const { data: schedules, isLoading } = useSchedules('PENDING')

  return (
    <Widget title="Agenda">
      {isLoading ? (
        <Skeleton className="h-32 w-1/5" />
      ) : (
        <CardInfo
          currentPage={APP_ROUTES.private.schedule}
          totalHome={calcularTotal(schedules)}
        />
      )}
      <CustomDialog
        triggerText="Agendar paciente"
        title="Agendar paciente"
        description="Preencha os campos com os dados para o agendamento."
      >
        <CreateScheduleForm />
      </CustomDialog>
    </Widget>
  )
}
