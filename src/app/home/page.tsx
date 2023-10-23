"use client";

import React from "react";
import DashboardHome from "@/components/Home/DashboardHome";
import HeaderHome from "@/components/Home/HeaderHome";
import { useMe } from "@/hooks/useMe";

export default function Home() {
  const { user } = useMe();
  
  if(!user) return <p>Loading...</p>
  return (
    <div>
      <HeaderHome user={user} />
      <DashboardHome user={user}/>
    </div>
  );
}