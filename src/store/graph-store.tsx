import { ScheduleStatus } from '@prisma/client'
import { create } from 'zustand'

import { VisualizationType } from '@/app/(private)/home/graph/_components/Dashboard/types'

interface GraphStore {
  visualizationType: VisualizationType
  setVisualizationType: (visualizationType: VisualizationType) => void

  patient: string | undefined
  setPatient: (patient: string) => void

  startDate: Date | undefined
  setStartDate: (startDate?: Date) => void

  endDate: Date | undefined
  setEndDate: (endDate?: Date) => void

  sessionStatus: ScheduleStatus[]
  setSessionStatus: (sessionStatus: ScheduleStatus[]) => void

  totalSessions: number
  setTotalSessions: (totalSessions: number) => void

  totalValue: number
  setTotalValue: (totalValue: number) => void

  isLoadingGraph: boolean
  setIsLoadingGraph: (isLoadingGraph: boolean) => void
}

export const useGraphStore = create<GraphStore>((set) => ({
  visualizationType: 'value' as VisualizationType,
  setVisualizationType: (visualizationType: VisualizationType) =>
    set({ visualizationType }),

  patient: undefined,
  setPatient: (patient: string) => set({ patient }),

  startDate: undefined,
  setStartDate: (startDate?: Date) => set({ startDate }),

  endDate: undefined,
  setEndDate: (endDate?: Date) => set({ endDate }),

  sessionStatus: [],
  setSessionStatus: (sessionStatus: ScheduleStatus[]) => set({ sessionStatus }),

  totalSessions: 0,
  setTotalSessions: (totalSessions: number) => set({ totalSessions }),

  totalValue: 0,
  setTotalValue: (totalValue: number) => set({ totalValue }),

  isLoadingGraph: false,
  setIsLoadingGraph: (isLoadingGraph: boolean) => set({ isLoadingGraph }),
}))
