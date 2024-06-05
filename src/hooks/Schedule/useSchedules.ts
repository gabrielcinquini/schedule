import { ScheduleStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'
import { ScheduleType } from '@/validations/validations'

export const useSchedules = (status: ScheduleStatus) => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<ScheduleType[]>(
        `/api/schedules?status=${status}`,
      )
      return res.data
    },
    queryKey: QUERY_KEYS.GET.SCHEDULES_FROM_USER(status),
  })
}
