'use client'

import { CpfConsent } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'

export const useRegisterPatientTherm = () => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<CpfConsent>('/api/therms/register-patient')
      return res.data
    },
    queryKey: QUERY_KEYS.GET.THERMS_REGISTER_PATIENT(),
  })
}
