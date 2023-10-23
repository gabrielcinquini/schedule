"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UseMeType } from "@/validations/validations";
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
        "/api/me",
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