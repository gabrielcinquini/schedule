import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGraphStore } from '@/store'

import { VisualizationType } from '../types'
import { DashboardFiltersForm } from './DashboardFiltersForm'

export function DashboardFilters() {
  const { visualizationType, setVisualizationType } = useGraphStore()
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Visualização e Filtros</CardTitle>
        <CardDescription>
          Selecione o tipo de visualização e os filtros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Visualização</Label>
          <Tabs
            defaultValue={visualizationType}
            className="w-full"
            onValueChange={(v) => setVisualizationType(v as VisualizationType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="value">Valor</TabsTrigger>
              <TabsTrigger value="quantity">Quantidade</TabsTrigger>
            </TabsList>
            <DashboardFiltersForm />
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
