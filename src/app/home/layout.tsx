"use client";

import Nav from "@/components/Nav";
import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-sm:text-xs">
      <Nav />
      {children}
    </div>
  );
}
