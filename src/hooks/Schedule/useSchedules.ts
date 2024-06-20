import { Schedule, ScheduleStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'

interface UseSchedulesProps {
  schedules: Schedule[]
  totalPages: number
  totalCount: number
}

export const useSchedules = (
  status: ScheduleStatus[],
  currentPage?: number,
  itemsPerPage?: number,
) => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<UseSchedulesProps>('/api/schedules', {
        params: {
          status,
          currentPage,
          perPage: itemsPerPage,
        },
      })
      return res.data
    },
    queryKey: QUERY_KEYS.GET.SCHEDULES_FROM_USER(
      status,
      currentPage,
      itemsPerPage,
    ),
  })
}
