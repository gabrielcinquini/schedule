"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CardInfo from "@/components/CardInfo";
import ModeToggle from "@/components/ui/mode-toggle";
import { useSchedules } from "@/hooks/Schedule/useSchedules";

import { calcularTotal } from "@/utils/utils";

export function HeaderTotal() {
  const { data: completedSchedules, isLoading: isLoadingCompletedSchedules } = useSchedules('COMPLETED')
  const { data: canceledSchedules, isLoading: isLoadingCanceledSchedules } = useSchedules('CANCELED')

  const isLoading = isLoadingCompletedSchedules || isLoadingCanceledSchedules;

  return (
    <header className="border-b border-border/40 max-sm:h-1/6 lg:py-6 lg:px-32 md:py-8 md:px-12 max-sm:py-2 max-sm:px-4">
      <div className="gap-4 flex justify-between container">
        <h1 className="text-3xl font-bold max-sm:text-xl">Total</h1>
        {isLoading ? (
          <div className="gap-2 flex w-full h-full justify-center">
            <Skeleton className="w-1/4 h-32" />
            <Skeleton className="w-1/4 h-32" />
          </div>
        ) : (
          <CardInfo currentPage='total' totalReceived={calcularTotal(completedSchedules)} totalNotReceived={calcularTotal(canceledSchedules)} />
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
