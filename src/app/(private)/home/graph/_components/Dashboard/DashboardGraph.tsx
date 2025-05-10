import { useEffect } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGraphStats } from '@/hooks/Graph/useGraphStats'
import { useGraphStore } from '@/store'

export function DashboardGraph() {
  const {
    visualizationType,
    patient,
    startDate,
    endDate,
    sessionStatus,
    setTotalSessions,
    setTotalValue,
    setIsLoadingGraph,
  } = useGraphStore()

  const { data: graphData, isLoading } = useGraphStats({
    patient,
    startDate,
    endDate,
    sessionStatus,
  })

  useEffect(() => {
    setIsLoadingGraph(isLoading)
    if (graphData) {
      const totalSessions = graphData?.reduce(
        (acc, curr) => acc + curr.totalSessions,
        0,
      )
      setTotalSessions(totalSessions)

      const totalValue = graphData?.reduce(
        (acc, curr) => acc + curr.totalValue,
        0,
      )
      setTotalValue(totalValue)
    }
  }, [graphData, setTotalSessions, setTotalValue, setIsLoadingGraph, isLoading])

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {visualizationType === 'value'
            ? 'Valores (R$)'
            : 'Quantidade de Sessões'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              dataKey={
                visualizationType === 'value' ? 'totalValue' : 'totalSessions'
              }
            />
            <Tooltip
              formatter={(value: number) =>
                visualizationType === 'value'
                  ? [
                      `${new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)}`,
                      'Valor',
                    ]
                  : [value, 'Sessões']
              }
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={
                visualizationType === 'value' ? 'totalValue' : 'totalSessions'
              }
              fill="hsl(var(--primary))"
              name={
                visualizationType === 'value'
                  ? 'Valor (R$)'
                  : 'Quantidade de Sessões'
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
