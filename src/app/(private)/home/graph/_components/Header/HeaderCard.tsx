import CountUp from 'react-countup'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HeaderCardProps {
  title: string
  type: 'currency' | 'number'
  value: number
}

export function HeaderCard({ title, type, value }: HeaderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <CountUp
            end={value}
            duration={2}
            prefix={`${type === 'currency' ? 'R$ ' : ''}`}
            decimal={`${type === 'currency' ? '.' : ''}`}
            decimals={type === 'currency' ? 2 : 0}
          />
        </div>
      </CardContent>
    </Card>
  )
}
