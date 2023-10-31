"use client";

import React from "react";
import { UseMeType } from "@/validations/validations";
import Header from "../Header";

export default function HeaderTotal({ user }: { user: UseMeType }) {
  return (
    <>
      <Header user={user} currentPage="total" />
    </>
  );
}
