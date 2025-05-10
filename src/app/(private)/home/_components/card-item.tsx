import React from 'react'
import CountUp from 'react-countup'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
type CardItemProps = {
  title: string
  total: number
  isReceived?: boolean
}

export function CardItem({ title, total, isReceived }: CardItemProps) {
  return (
    <Card className="flex gap-2 p-2">
      <h1 className="text-muted-foreground">{title}</h1>
      <span className={cn(isReceived ? 'text-green-500' : 'text-destructive')}>
        <CountUp
          end={total}
          duration={2}
          prefix="R$ "
          decimal="."
          decimals={2}
        />
      </span>
    </Card>
  )
}
