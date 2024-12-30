'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QUERY_KEYS } from '@/constants/query-keys'

import { AlertDestructive } from './alert-destruvtive'
import { getSchedulesByDate } from './services'

interface DailyListProps {
  date: Date
}

export const DailyList = ({ date }: DailyListProps) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: QUERY_KEYS.GET.SCHEDULES_BY_DATE(date),
    queryFn: async () => await getSchedulesByDate(date),
  })

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-6 w-5/6" />
        ))}
      </div>
    )
  }

  if (isError)
    return (
      <AlertDestructive>
        Erro ao buscar os pacientes deste diaaa
      </AlertDestructive>
    )

  if (data?.schedules.length === 0)
    return <center>Nenhum paciente agendado para este diaaa</center>

  return (
    <ul className="flex flex-col gap-2">
      {data?.schedules.map((schedule) => {
        const isIsento = schedule.value === 0

        return (
          <li
            key={schedule.id}
            className="flex items-center justify-between gap-2"
          >
            {schedule.patient.name} -{' '}
            {format(new Date(schedule.date), 'HH:mm', { locale: ptBR })}{' '}
            <Badge
              className="flex w-20 items-center justify-center"
              variant={isIsento ? 'secondary' : 'default'}
            >
              {isIsento
                ? 'Isento'
                : new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(schedule.value)}
            </Badge>
          </li>
        )
      })}
    </ul>
  )
}
