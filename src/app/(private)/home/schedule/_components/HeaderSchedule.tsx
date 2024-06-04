"use client";

import React, {  } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import ModeToggle from "@/components/ui/mode-toggle";
import { CreateScheduleForm } from "./CreateScheduleForm";
import { useSchedules } from "@/hooks/Schedule/useSchedules";
import { Skeleton } from "@/components/ui/skeleton";
import CardInfo from "@/components/CardInfo";
import { calcularTotal } from "@/utils/utils";

export function HeaderSchedule() {
  const { data: schedules, isLoading } = useSchedules('PENDING');

  return (
    <header className="border-b border-border/40 max-sm:h-1/6 lg:py-6 lg:px-32 md:py-8 md:px-12 max-sm:py-2 max-sm:px-4">
      <div className="flex gap-4 justify-between container">
        <h1 className="text-3xl font-bold max-sm:text-xl text-end ">Agenda</h1>
        {isLoading ? <Skeleton className="w-1/5 h-32" /> : <CardInfo currentPage='schedule' totalHome={calcularTotal(schedules)} />}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Agendar paciente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agendar paciente</DialogTitle>
                <DialogDescription>
                  Preencha os campos com os dados para o agendamento.
                </DialogDescription>
              </DialogHeader>
              <CreateScheduleForm />
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
