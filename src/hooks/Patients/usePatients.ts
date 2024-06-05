import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'
import { PatientType } from '@/validations/validations'

export const usePatients = () => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<PatientType[]>(`/api/patient`)
      return res.data
    },
    queryKey: QUERY_KEYS.GET.PATIENTS_FROM_USER(),
  })
}
