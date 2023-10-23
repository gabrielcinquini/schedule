"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UseMeType, useMeSchema } from "@/validations/validations";
import { useStore } from "@/store";

export function useMe() {
  const { user, setUser } = useStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const router = useRouter();

  async function getUser() {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token missing");

      const response = await axios.get<UseMeType>(
        `${process.env.NEXT_PUBLIC_APIURL}/api/me`,
        {
          headers: { Authorization: token },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Erro:", error); // Registre qualquer erro ocorrido
      localStorage.removeItem("token");
      router.push("/");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return { user };
}
