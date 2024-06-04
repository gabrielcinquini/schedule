"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { useSchedules } from "@/hooks/Schedule/useSchedules";
import { Skeleton } from "@/components/ui/skeleton";
import { SchedulesList } from "./SchedulesList";

export default function DashboardSchedule() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  const { data: schedules, isLoading } = useSchedules('PENDING')

  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSchedules = schedules?.filter((schedule) => {
    const fullName = `${schedule.name} ${schedule.lastName}`.toLowerCase();
    return (
      fullName.includes(filter.toLowerCase())
    );
  });

  const totalPages =
    filteredSchedules ?
    filteredSchedules.length > 0
      ? Math.ceil(filteredSchedules.length / itemsPerPage)
      : 1 : 1;

  return (
    <div className="container">
      <Input
        type="text"
        placeholder="Filtrar por nome/valor/data/dia"
        value={filter}
        onChange={(e) => {
          setCurrentPage(1);
          setFilter(e.target.value);
        }}
        className="mt-2 w-1/2 max-sm:w-full"
      />
      <Table>
        <TableCaption>Sua agenda.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Nome</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      // onClick={() => {
                      //   setSchedules(
                      //     [...schedules].sort((a, b) => {
                      //       const dateA = new Date(a.date);
                      //       const dateB = new Date(b.date);
                      //       return dateA.getTime() - dateB.getTime();
                      //     })
                      //   );
                      // }}
                    >
                      Padrão
                    </Button>
                    <Button
                      // onClick={() => {
                      //   setSchedules(
                      //     [...schedules].sort((a, b) => {
                      //       return a.name.localeCompare(b.name);
                      //     })
                      //   );
                      // }}
                    >
                      Nome Crescente
                    </Button>
                    <Button
                      // onClick={() => {
                      //   setSchedules(
                      //     [...schedules].sort((a, b) => {
                      //       return b.name.localeCompare(a.name);
                      //     })
                      //   );
                      // }}
                    >
                      Nome Decrescente
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Data</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      // onClick={() => {
                      //   setSchedules(
                      //     [...schedules].sort((a, b) => {
                      //       const dateA = new Date(a.date);
                      //       const dateB = new Date(b.date);
                      //       return dateA.getTime() - dateB.getTime();
                      //     })
                      //   );
                      // }}
                    >
                      Data Crescente
                    </Button>
                    <Button
                      // onClick={() => {
                      //   setSchedules(
                      //     [...schedules].sort((a, b) => {
                      //       const dateA = new Date(a.date);
                      //       const dateB = new Date(b.date);
                      //       return dateB.getTime() - dateA.getTime();
                      //     })
                      //   );
                      // }}
                    >
                      Data Decrescente
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>
              <Popover>Valor</Popover>
            </TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-10" />
                </TableCell>
              </TableRow>
            ))}
          <SchedulesList schedules={schedules} startIndex={startIndex} endIndex={endIndex} />
        </TableBody>
      </Table>
      <div className="flex gap-2 px-8">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          variant={"harderOutline"}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Button>
        <span className="ml-4 mr-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <Button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          variant={"harderOutline"}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
