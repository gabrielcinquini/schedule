import { ScheduleStatus } from '@prisma/client'

export const QUERY_KEYS = {
  GET: {
    PATIENTS_FROM_USER: (currentPage?: number, itemsPerPage?: number) => [
      'patients',
      currentPage,
      itemsPerPage,
    ],
    SCHEDULES_FROM_USER: (
      status: ScheduleStatus[],
      currentPage?: number,
      itemsPerPage?: number,
    ) => ['schedules', status, currentPage, itemsPerPage],
    SUM_SCHEDULES: () => ['sumSchedules'],
    THERMS_REGISTER_PATIENT: () => ['therms', 'registerPatient'],
  },

  MUTATE: {
    PATIENTS_FROM_USER: () => ['patients'],
    SCHEDULES_FROM_USER: () => ['schedules'],
  },
}
