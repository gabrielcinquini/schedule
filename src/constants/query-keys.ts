import { ScheduleStatus } from '@prisma/client'

export const QUERY_KEYS = {
  GET: {
    PATIENTS_FROM_USER: () => ['patients'],
    SCHEDULES_FROM_USER: (status: ScheduleStatus) => ['schedules', status],
  },

  MUTATE: {
    PATIENTS_FROM_USER: () => ['patients'],
    SCHEDULES_FROM_USER: () => ['schedules'],
  },
}
