'use client'

import React from 'react'

import { CustomDialog } from '@/app/(private)/home/_components/custom-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useSumSchedules } from '@/hooks/Schedule/useSumSchedules'
import { APP_ROUTES } from '@/routes/paths'

import { CardInfo } from '../../_components/card-info'
import { Widget } from '../../_components/widget'
import { CreateScheduleForm } from './CreateScheduleForm'

export function HeaderSchedule() {
  const { data: totalPedingSchedules, isLoading } = useSumSchedules()

  return (
    <Widget title="Agenda">
      {isLoading ? (
        <Skeleton className="max-sm:h-24 max-sm:w-1/2 sm:h-32 sm:w-1/4" />
      ) : (
        <CardInfo
          currentPage={APP_ROUTES.private.schedule}
          totalHome={totalPedingSchedules?.pending}
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
