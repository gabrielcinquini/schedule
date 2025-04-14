'use client'

import { useQuery } from '@tanstack/react-query'
import { isSameDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { QUERY_KEYS } from '@/constants/query-keys'

import { AlertDestructive } from './alert-destruvtive'
import { DailyList } from './daily-list'
import { getAvailableDaysForSchedule } from './services'

export const SearchCalendarModal = () => {
  const [date, setDate] = useState(new Date())

  const { data: availableDates, isError } = useQuery({
    queryKey: QUERY_KEYS.GET.SCHEDULES_FROM_USER(['PENDING']),
    queryFn: async () => await getAvailableDaysForSchedule(),
  })

  const enabledDates = availableDates
    ? availableDates.schedules.map((i) => i.date)
    : [new Date()]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-sm:w-full">
          <CalendarIcon className="mr-2" size={16} />
          Ver agenda por calendário
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-md:flex-col md:max-w-xl">
        <Calendar
          className="flex items-center justify-center"
          mode="single"
          selected={date}
          onSelect={(e) => setDate((d) => e || d)}
          disabled={(date: Date) =>
            !enabledDates.some((ed) => isSameDay(ed, date))
          }
        />
        {isError && (
          <AlertDestructive>
            Erro ao buscar as datas com uma agenda
          </AlertDestructive>
        )}
        <DailyList date={date} />
      </DialogContent>
    </Dialog>
  )
}
