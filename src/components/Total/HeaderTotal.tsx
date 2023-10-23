"use client";

import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { UseMeType } from "@/validations/validations";
import Header from "../Header";

export default function HeaderTotal({ user }: { user: UseMeType }) {
  const router = useRouter();

  return (
    <>
      <Header user={user} currentPage="total" />
      <ToastContainer />
    </>
  );
}
