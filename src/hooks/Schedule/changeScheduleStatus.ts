import { ScheduleStatus } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

import { QUERY_KEYS } from '@/constants/query-keys'
import { revalidateQueryKey } from '@/utils/utils'

interface IChangeScheduleStatus {
  id: string
  status: ScheduleStatus
  date: Date
}

export const useChangeScheduleStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...rest }: IChangeScheduleStatus) => {
      return await axios.patch(`/api/schedules/${id}`, { ...rest })
    },
    onSuccess: (response: AxiosResponse) => {
      toast.success(response.data.message)
      revalidateQueryKey(
        [
          QUERY_KEYS.MUTATE.SCHEDULES_FROM_USER(),
          QUERY_KEYS.MUTATE.SUM_SCHEDULES(),
        ],
        queryClient,
      )
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
        console.error(err)
      } else {
        toast.error('Ocorreu um erro inesperado')
      }
    },
  })
}
