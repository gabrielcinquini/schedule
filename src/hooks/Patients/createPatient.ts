import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

import { revalidateQueryKey } from '@/utils/utils'
import { RegisterPatientFormType } from '@/validations/validations'

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterPatientFormType) => {
      return await axios.post('/api/patient', {
        name: data.name,
        lastName: data.lastName,
        cpf: data.cpf,
        convenio: data.convenio,
      })
    },
    onSuccess: (response: AxiosResponse) => {
      toast.success(response.data.message)
      revalidateQueryKey(['patients'], queryClient)
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
