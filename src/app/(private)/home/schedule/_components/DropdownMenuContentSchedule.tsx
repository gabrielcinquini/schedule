import React from 'react'

import {
  DropdownMenuContent,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useChangeScheduleStatus } from '@/hooks/Schedule/changeScheduleStatus'
import { useDeleteSchedule } from '@/hooks/Schedule/deleteSchedule'
import { ScheduleType } from '@/validations/validations'

import { ConfirmationsSchedule } from './ConfirmationsSchedule'

interface DropdownMenuContentScheduleProps {
  schedule: ScheduleType
}

export function DropdownMenuContentSchedule({
  schedule,
}: DropdownMenuContentScheduleProps) {
  const { mutateAsync: onDeleteSchedule, isPending } = useDeleteSchedule()
  const { mutateAsync: onChangeScheduleStatus } = useChangeScheduleStatus()

  const handleDelete = async (id: string, deleteAllFuture: boolean) => {
    await onDeleteSchedule({ id, deleteAllFuture })
  }

  const handleComplete = async (schedule: ScheduleType) => {
    await onChangeScheduleStatus({
      id: schedule.id,
      status: 'COMPLETED',
      date: schedule.date,
    })
  }

  const handleNotComplete = async (schedule: ScheduleType) => {
    await onChangeScheduleStatus({
      id: schedule.id,
      status: 'CANCELED',
      date: schedule.date,
    })
  }

  return (
    <DropdownMenuContent>
      <DropdownMenuGroup className="flex flex-col items-start">
        <ConfirmationsSchedule
          schedule={schedule}
          handleComplete={handleComplete}
          handleNotComplete={handleNotComplete}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
