"use client";

import Nav from "@/components/Nav";
import { useMe } from "@/hooks/useMe";
import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  const { user } = useMe();
  if (!user) return <p>Loading...</p>;
  return (
    <div className="max-sm:text-xs">
      <Nav user={user} />
      {children}
    </div>
  );
}
