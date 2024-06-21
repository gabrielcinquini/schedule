import { ScheduleStatus } from '@prisma/client'

export const QUERY_KEYS = {
  GET: {
    PATIENTS_FROM_USER: (
      currentPage?: number,
      itemsPerPage?: number,
      search?: string,
    ) => ['patients', currentPage, itemsPerPage, search],
    SCHEDULES_FROM_USER: (
      status: ScheduleStatus[],
      currentPage?: number,
      itemsPerPage?: number,
      search?: string,
    ) => ['schedules', status, currentPage, itemsPerPage, search],
    SUM_SCHEDULES: () => ['sumSchedules'],
    THERMS_REGISTER_PATIENT: () => ['therms', 'registerPatient'],
  },

  MUTATE: {
    PATIENTS_FROM_USER: () => ['patients'],
    SCHEDULES_FROM_USER: () => ['schedules'],
  },
}
