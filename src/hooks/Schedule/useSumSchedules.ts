import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'

interface SumSchedulesProps {
  pending: number
  completed: number
  canceled: number
  average: number
}

export const useSumSchedules = () => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<SumSchedulesProps>('/api/sumSchedules', {
        params: {
          status,
        },
      })
      return res.data
    },
    queryKey: QUERY_KEYS.GET.SUM_SCHEDULES(),
  })
}
