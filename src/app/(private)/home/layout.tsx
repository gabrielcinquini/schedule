import { Header } from "@/components/ui/Header/Header";
import { getServerSessionApp } from "@/lib";
import { redirect } from "next/navigation";
import React from "react";
export default async function PrivateLayoutRoot({ children }: { children: React.ReactNode }) {
  const session = await getServerSessionApp();

  if(!session) {
    redirect('/')
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
