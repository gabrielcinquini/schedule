'use client';

import React from "react";
import { Button } from "../../../../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import ModeToggle from "@/components/ui/mode-toggle";
import { RegisterPatientForm } from "./RegisterPatientForm";

export function HeaderPatients() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur p-12'>
      <div className="flex gap-4 justify-between items-center container">
        <h1 className="text-3xl font-bold max-sm:text-xl">Dashboard</h1>
        <div className="flex gap-2 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Cadastrar paciente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar paciente</DialogTitle>
                <DialogDescription>
                  Preencha os campos com os dados do paciente.
                </DialogDescription>
              </DialogHeader>
              <RegisterPatientForm />
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
