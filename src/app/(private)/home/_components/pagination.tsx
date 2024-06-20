// lastPage => db.count amount of items to display and math to find the lastPage
// currentPage, onPageChange => useState()
// pageSize => itemsPerPage
// totalCount => db.count amount of items to display

'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface IPaginationProps {
  lastPage?: number
  currentPage?: number
  siblingsCount?: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalCount?: number
  className?: Parameters<typeof cn>[0]
}

export const Pagination = ({
  currentPage = 1,
  onPageChange,
  lastPage = 1,
  siblingsCount = 2,
  pageSize = 0,
  totalCount = 0,
  className,
}: IPaginationProps) => {
  const pagesArray = Array.from({ length: lastPage }).map(
    (_, index) => index + 1,
  )

  const start = Math.max(1, currentPage - siblingsCount)
  const end = Math.min(currentPage + siblingsCount, lastPage)
  const pages =
    pagesArray.length >= 8 ? pagesArray.slice(start - 1, end) : pagesArray

  const labels = useMemo(() => {
    if (!pageSize || !totalCount) return undefined

    const from = (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, totalCount)

    return { from, to }
  }, [pageSize, totalCount, currentPage])

  const { isNotShowingFirstPage, isNotShowingLastPage } = useMemo(() => {
    return {
      isNotShowingFirstPage: !pages.some((page) => page === 1),
      isNotShowingLastPage: !pages.some((page) => page === lastPage),
    }
  }, [pages, lastPage])

  // if (totalCount === 0) return null;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex flex-1 flex-col items-center gap-2 lg:flex-row',
          className,
        )}
      >
        {labels && (
          <div className="flex-1 whitespace-nowrap">
            Exibindo {labels.from} de {labels.to} do total de {totalCount}{' '}
            resultados
          </div>
        )}

        <div className="flex items-center gap-2">
          {lastPage > 1 && (
            <Tooltip>
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="icon"
                className="h-8 w-8 border-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}

          {isNotShowingFirstPage && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <Button
                  variant="outline"
                  onClick={() => onPageChange(1)}
                  size="icon"
                  className="h-8 w-8 border-2"
                >
                  1
                </Button>
              </Tooltip>
              <span>...</span>
            </div>
          )}

          {currentPage &&
            lastPage !== 1 &&
            pages.map((page) => (
              <Tooltip key={page}>
                <Button
                  variant={page === currentPage ? 'secondary' : 'outline'}
                  onClick={() => onPageChange(page)}
                  size="icon"
                  className="h-8 w-8 border-2 border-border"
                >
                  {page}
                </Button>
              </Tooltip>
            ))}

          {isNotShowingLastPage && (
            <div className="flex items-center gap-2">
              <span>...</span>
              <Tooltip>
                <Button
                  variant="outline"
                  onClick={() => onPageChange(lastPage)}
                  size="icon"
                  className="h-8 w-8 border-2"
                >
                  {lastPage}
                </Button>
              </Tooltip>
            </div>
          )}
          {lastPage > 1 && currentPage < lastPage && (
            <Tooltip>
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                size="icon"
                className="h-8 w-8 border-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
