import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MenuIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalize } from "@/utils/utils";
import { ScheduleType } from "@/validations/validations";

import { DropdownMenuContentSchedule } from "./DropdownMenuContentSchedule";
import { cn } from "@/lib";
import { UseSchedulesProps } from "@/hooks/Schedule/useSchedules";

interface PatientsListProps {
  schedules?: UseSchedulesProps["schedules"];
}

export function SchedulesList({ schedules }: PatientsListProps) {
  return (
    <>
      {schedules?.map((schedule) => (
        <Card
          className={cn(
            schedule.isToday && "border-l-4 border-l-blue-400",
            schedule.isPast && "border-l-4 border-l-card-foreground/50",
            !schedule.isPast &&
              !schedule.isToday &&
              "border-l-4 border-l-yellow-400",
          )}
          key={schedule.id}
        >
          <CardHeader>
            <CardTitle className="flex w-full items-center justify-between">
              {schedule.name}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-2" variant="ghost">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContentSchedule schedule={schedule} />
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex gap-2">
              <span className="font-bold">Data:{`${" "}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(schedule.date), "dd/MM/yy")}
              </span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold">Dia:{`${" "}`}</span>
              <span className="text-muted-foreground">
                {capitalize(
                  format(new Date(schedule.date), "EE", { locale: ptBR }),
                )}
              </span>
            </p>
            <p>
              <span className="font-bold">Hora: {`${" "}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(schedule.date), "HH:mm", { locale: ptBR })}
              </span>
            </p>
            <p>
              <span className="font-bold">Valor: {`${" "}`}</span>
              <span className="text-muted-foreground">
                {schedule.value === 0
                  ? "Isento"
                  : new Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(schedule.value)}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
