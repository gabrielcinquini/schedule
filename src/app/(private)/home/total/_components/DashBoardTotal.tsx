"use client"

import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { useSchedules } from "@/hooks/Schedule/useSchedules";
import { TotalItemsList } from "./TotalItemsList";
import { Skeleton } from "@/components/ui/skeleton";

export function DashBoardTotal() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  const { data: completedSchedules, isLoading: isLoadingCompletedSchedules } = useSchedules('COMPLETED')
  const { data: canceledSchedules, isLoading: isLoadingCanceledSchedules } = useSchedules('CANCELED')

  const isLoading = isLoadingCompletedSchedules || isLoadingCanceledSchedules;

  const itemsPerPage = 5;

  const totalItems = [...(completedSchedules ?? []), ...(canceledSchedules ?? [])];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredTotalItems = totalItems?.filter((schedule) => {
    const fullName = `${schedule.name} ${schedule.lastName}`.toLowerCase();
    return (
      fullName.includes(filter.toLowerCase())
    );
  });

  const totalPages =
    filteredTotalItems ?
    filteredTotalItems.length > 0
      ? Math.ceil(filteredTotalItems.length / itemsPerPage)
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
        <TableCaption>Sua lista de serviços.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Valor</TableHead>
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
          <TotalItemsList totalItems={filteredTotalItems} startIndex={startIndex} endIndex={endIndex} />
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
