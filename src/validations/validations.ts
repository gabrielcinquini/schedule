import { ScheduleStatus } from '@prisma/client'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, 'Mínimo de 3 caracteres')
    .regex(/^([a-z]|[0-9])+$/, 'Formato inválido'),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, 'Nome inválido(Joe)'),
  password: z.string().min(1, 'Mínimo de 1 caracter'),
  provider: z.string().regex(/^[a-z]+$/, 'Formato inválido'),
  createdAt: z.string(),
  lastLogin: z.string(),
  email: z.string().email(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  avatarUrl: z.string().optional(),
})

export const loginUserFormSchema = userSchema.pick({
  username: true,
  password: true,
})
export type LoginUserType = z.infer<typeof loginUserFormSchema>

export const registerUserFormSchema = z
  .object({
    username: z.string().min(3, 'Mínimo de 3 caracteres'),
    firstname: z.string().min(3, 'Mínimo de 3 caracteres'),
    lastname: z.string().min(3, 'Mínimo de 3 caracteres'),
    email: z.string().email(),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) return false
      return true
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    },
  )
  .transform(({ ...data }) => ({
    ...data,
    fullname: `${data.firstname} ${data.lastname}`,
  }))
export type RegisterUserType = z.infer<typeof registerUserFormSchema>

export const scheduleSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, 'Nome inválido(Joe)'),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      'Sobrenome inválido(Silva)',
    ),
  date: z.coerce.date(),
  value: z.coerce.number(),
  status: z.nativeEnum(ScheduleStatus),
  patientId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.coerce.date(),
})
export type ScheduleType = z.infer<typeof scheduleSchema>

export const createScheduleSchema = scheduleSchema.pick({
  name: true,
  lastName: true,
  date: true,
  time: true,
  value: true,
  patientId: true,
})
export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>

export const registerToScheduleFormSchema = z
  .object({
    date: z.date(),
    time: z.string().regex(/^[0-9]{2}:[0-9]{2}$/, 'Formato inválido'),
    value: z.string().refine(
      (value) => {
        const transformedValue = value
          .replace(/\s/g, '')
          .replace('R$', '')
          .replace(',', '.')
        return parseFloat(transformedValue) >= 0
      },
      {
        message: 'Formato inválido: deve ser um valor monetário positivo',
        path: ['value'],
      },
    ),
    patientId: z.string().uuid(),
  })
  .refine(
    (data) => {
      const date = new Date(data.date)
      const hora = data.time
      const [novaHora, novosMinutos] = hora.split(':')
      date.setHours(parseInt(novaHora, 10))
      date.setMinutes(parseInt(novosMinutos, 10))
      const currentDate = new Date()
      return date >= currentDate
    },
    {
      message: 'Só é possível realizar o agendamento para uma data futura',
      path: ['time'],
    },
  )
export type RegisterScheduleFormType = z.infer<
  typeof registerToScheduleFormSchema
>

export const updateScheduleSchema = scheduleSchema.pick({
  date: true,
  status: true,
})
export type UpdateScheduleType = z.infer<typeof updateScheduleSchema>

export const patientSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, 'Nome inválido(Joe)'),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      'Sobrenome inválido(Silva)',
    ),
  convenio: z.string().min(3, 'Deve conter ao menos 3 caracteres'),
  lastConsult: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  userId: z.string().uuid(),
})
export type PatientType = z.infer<typeof patientSchema>

export const registerPatientFormSchema = patientSchema.pick({
  name: true,
  lastName: true,
  convenio: true,
})
export type RegisterPatientFormType = z.infer<typeof registerPatientFormSchema>

export const updateProfileFormSchema = z
  .object({
    newPassword: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) return false
      return true
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    },
  )

export type ForgotPasswordFormSchemaType = z.infer<
  typeof updateProfileFormSchema
>
