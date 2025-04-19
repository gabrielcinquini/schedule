import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

import { QUERY_KEYS } from '@/constants/query-keys'
import { revalidateQueryKey } from '@/utils/utils'
import { CreateScheduleSchema } from '@/validations/validations'

export const useCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (schedule: CreateScheduleSchema) => {
      return await axios.post('/api/schedules', {
        name: schedule.name,
        date: schedule.date,
        value: schedule.value,
        patientId: schedule.patientId,
        frequency: schedule.frequency,
      })
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
