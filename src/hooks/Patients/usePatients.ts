'use client'

import { Patient } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { QUERY_KEYS } from '@/constants/query-keys'

interface UsePatientsProps {
  patients: Patient[]
  totalPages: number
  totalCount: number
}

export const usePatients = (currentPage?: number, itemsPerPage?: number) => {
  return useQuery({
    queryFn: async () => {
      const res = await axios.get<UsePatientsProps>('/api/patient', {
        params: {
          currentPage,
          perPage: itemsPerPage,
        },
      })

      return res.data
    },
    queryKey: QUERY_KEYS.GET.PATIENTS_FROM_USER(currentPage, itemsPerPage),
  })
}
