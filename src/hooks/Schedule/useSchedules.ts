import { Schedule, ScheduleStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'
import { type PatientType } from '@/validations/validations'

export interface UseSchedulesProps {
  schedules: (Schedule & { isPast: boolean; isToday: boolean } & {
    patient: Pick<PatientType, 'name' | 'phone'>
  })[]
  totalPages: number
  totalCount: number
}

export const useSchedules = (
  status: ScheduleStatus[],
  currentPage?: number,
  itemsPerPage?: number,
  search?: string,
) => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<UseSchedulesProps>('/api/schedules', {
        params: {
          status,
          currentPage,
          perPage: itemsPerPage,
          search,
        },
      })
      return res.data
    },
    queryKey: QUERY_KEYS.GET.SCHEDULES_FROM_USER(
      status,
      currentPage,
      itemsPerPage,
      search,
    ),
  })
}
