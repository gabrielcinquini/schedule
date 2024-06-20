import React from 'react'
import CountUp from 'react-countup'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_ROUTES } from '@/routes/paths'

type CardProps = {
  currentPage:
    | typeof APP_ROUTES.private.schedule
    | typeof APP_ROUTES.private.total
  totalHome?: number
  totalReceived?: number
  totalNotReceived?: number
}

export function CardInfo({
  currentPage,
  totalHome,
  totalReceived,
  totalNotReceived,
}: CardProps) {
  return (
    <>
      {currentPage === APP_ROUTES.private.schedule && (
        <Card className="bg-green-700 max-sm:min-w-[150px] sm:min-w-[250px]">
          <CardHeader>
            <CardTitle className="text-white max-sm:text-lg">
              Total a Receber
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <h1 className="text-2xl text-white max-sm:text-lg">
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
      )}{' '}
      {currentPage === APP_ROUTES.private.total && (
        <>
          <div className="flex w-full items-center justify-center gap-2">
            <Card className="bg-green-700 max-sm:min-w-[150px] sm:min-w-[250px]">
              <CardHeader>
                <CardTitle className="text-white max-sm:text-lg">
                  Total Recebido
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <h1 className="text-2xl text-white max-sm:text-lg">
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
            <Card className="bg-destructive max-sm:min-w-[150px] sm:min-w-[250px]">
              <CardHeader>
                <CardTitle className="text-white max-sm:text-lg">
                  Total Perdido
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <h1 className="text-2xl text-white max-sm:text-lg">
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
          <div />
        </>
      )}
    </>
  )
}
