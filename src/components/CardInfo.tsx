import React from 'react'
import CountUp from 'react-countup'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CardProps = {
  currentPage: string
  totalHome?: number
  totalReceived?: number
  totalNotReceived?: number
}

export default function CardInfo({
  currentPage,
  totalHome,
  totalReceived,
  totalNotReceived,
}: CardProps) {
  return (
    <>
      {currentPage === 'schedule' ? (
        <Card className="bg-green-600 max-sm:w-fit">
          <CardHeader>
            <CardTitle>Total a Receber</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <h1 className="text-2xl max-sm:text-lg">
              <CountUp
                end={totalHome || 0}
                duration={2}
                prefix="R$ "
                decimal=","
                decimals={2}
              />
            </h1>
          </CardContent>
        </Card>
      ) : currentPage === 'total' ? (
        <div className="flex gap-2">
          <Card className="min-w-[250px] bg-green-700">
            <CardHeader>
              <CardTitle>Total Recebido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg">
                <CountUp
                  end={totalReceived || 0}
                  duration={2}
                  prefix="R$ "
                  decimal=","
                  decimals={2}
                />
              </h1>
            </CardContent>
          </Card>
          <Card className="min-w-[250px] bg-destructive">
            <CardHeader>
              <CardTitle>Total Perdido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg">
                <CountUp
                  end={totalNotReceived || 0}
                  duration={2}
                  prefix="R$ "
                  decimal=","
                  decimals={2}
                />
              </h1>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
