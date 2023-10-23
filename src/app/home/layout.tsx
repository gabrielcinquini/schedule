"use client";

import Nav from "@/components/Nav";
import React, { ReactComponentElement } from "react";
import Home from "../page";
import { useMe } from "@/hooks/useMe";
import { usePatients } from "@/hooks/usePatients";
import { useSchedules } from "@/hooks/useSchedules";
import { useServices } from "@/hooks/useServices";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-sm:text-xs">
      <Nav />
      {children}
    </div>
  );
}
