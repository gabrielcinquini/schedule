'use client'

import { ScheduleStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePatients } from '@/hooks/Patients/usePatients'
import { cn } from '@/lib'
import { useGraphStore } from '@/store'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardFiltersForm() {
  const { data, isLoading } = usePatients()

  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const {
    patient,
    setPatient,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sessionStatus,
    setSessionStatus,
  } = useGraphStore()

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Paciente</Label>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            onValueChange={setPatient}
            value={patient}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os pacientes</SelectItem>
              {data?.patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id.toString()}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col space-y-2">
          <Label>De</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full px-2 py-5 text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                {startDate ? (
                  format(Number(startDate), 'PPP', {
                    locale: ptBR,
                  })
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setStartDate(date)
                    setStartDateOpen(false)
                  }
                }}
                disabled={(date) => date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>Até</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full px-2 py-5 text-left font-normal',
                  !endDate && 'text-muted-foreground',
                )}
              >
                {endDate ? (
                  format(Number(endDate), 'PPP', {
                    locale: ptBR,
                  })
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={endDate}
                onSelect={(date) => {
                  if (date) {
                    setEndDate(date)
                    setEndDateOpen(false)
                  }
                }}
                disabled={(date) => date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status das Sessões</Label>
        <div className="space-y-2">
          {Object.values(ScheduleStatus).map((status) => (
            <div
              key={status}
              className="flex flex-row items-start space-x-3 space-y-0"
            >
              <Checkbox
                id={status}
                checked={sessionStatus.includes(status)}
                onCheckedChange={(checked) => {
                  const currentStatus = sessionStatus
                  const newStatus = checked
                    ? [...currentStatus, status]
                    : currentStatus.filter((s) => s !== status)
                  setSessionStatus(newStatus)
                }}
              />
              <Label htmlFor={status} className="font-normal">
                Sessões{' '}
                {status === 'COMPLETED'
                  ? 'Concluídas'
                  : status === 'PENDING'
                    ? 'Pendentes'
                    : 'Canceladas'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="default"
        className="w-full"
        onClick={() => {
          setPatient('all')
          setStartDate(undefined)
          setEndDate(undefined)
          setSessionStatus([])
        }}
      >
        Limpar Filtros
      </Button>
    </div>
  )
}
