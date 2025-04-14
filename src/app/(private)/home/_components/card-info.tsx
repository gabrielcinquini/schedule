import React from 'react'

import { APP_ROUTES } from '@/routes/paths'

import { CardItem } from './card-item'

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
        <CardItem title="Total a Receber:" total={totalHome || 0} isReceived />
      )}{' '}
      {currentPage === APP_ROUTES.private.total && (
        <>
          <div className="flex w-full gap-2 max-sm:flex-col sm:items-center sm:justify-center">
            <CardItem
              title="Total Recebido:"
              total={totalReceived || 0}
              isReceived
            />
            <CardItem title="Total Perdido:" total={totalNotReceived || 0} />
          </div>
          <div />
        </>
      )}
    </>
  )
}
