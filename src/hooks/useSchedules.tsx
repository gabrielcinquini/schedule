"use client";

import { useEffect } from "react";
import axios from "axios";
import { useStore } from "@/store";
import { UseMeType } from "@/validations/validations";

export function useSchedules({user}: {user: UseMeType}) {
  const { schedules, setSchedules } = useStore((state) => ({
    schedules: state.schedules,
    setSchedules: state.setSchedules,
  }));

  async function getSchedules() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APIURL}/api/schedules/${user.id}`
      );
      setSchedules(response.data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    getSchedules();
  }, []);

  return { schedules, setSchedules };
}
