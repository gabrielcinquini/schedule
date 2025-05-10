'use client'

import { DashboardFilters } from './DashboardFilters'
import { DashboardGraph } from './DashboardGraph'

export function Dashboard() {
  return (
    <div className="grid grid-cols-6 gap-4 max-xl:grid-cols-1">
      <DashboardFilters />
      <div className="xl:col-span-4">
        <DashboardGraph />
      </div>
    </div>
  )
}
