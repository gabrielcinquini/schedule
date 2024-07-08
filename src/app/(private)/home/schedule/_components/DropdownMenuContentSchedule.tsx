import { LibraryIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useChangeScheduleStatus } from '@/hooks/Schedule/changeScheduleStatus'
import { useDeleteSchedule } from '@/hooks/Schedule/deleteSchedule'
import { ScheduleType } from '@/validations/validations'

import { ConfirmationsSchedule } from './ConfirmationsSchedule'
import { DialogContentSchedule } from './DialogContentSchedule'

interface DropdownMenuContentScheduleProps {
  schedule: ScheduleType
}

export function DropdownMenuContentSchedule({
  schedule,
}: DropdownMenuContentScheduleProps) {
  const { mutateAsync: onDeleteSchedule, isPending } = useDeleteSchedule()
  const { mutateAsync: onChangeScheduleStatus } = useChangeScheduleStatus()

  const handleDelete = async (id: string) => {
    await onDeleteSchedule(id)
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
      <DropdownMenuLabel>Detalhes</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="sm:hidden">
              <LibraryIcon className="mr-2" /> Detalhes
            </Button>
          </DialogTrigger>
          <DialogContentSchedule schedule={schedule} />
        </Dialog>
      </DropdownMenuGroup>
      <DropdownMenuSeparator className="sm:hidden" />
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
