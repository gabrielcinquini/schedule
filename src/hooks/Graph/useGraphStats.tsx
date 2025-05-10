import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'
import { DashboardFiltersFormType } from '@/validations'

type UseGraphStatsReturnType = {
  month: string
  totalValue: number
  totalSessions: number
}

export const useGraphStats = ({
  patient,
  startDate,
  endDate,
  sessionStatus,
}: DashboardFiltersFormType) => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<UseGraphStatsReturnType[]>('/api/graph', {
        params: {
          patientId: patient,
          startDate,
          endDate,
          'sessionStatus[]': sessionStatus,
        },
      })
      return res.data
    },
    queryKey: QUERY_KEYS.GET.GRAPH_STATS(
      patient,
      startDate,
      endDate,
      sessionStatus,
    ),
  })
}
