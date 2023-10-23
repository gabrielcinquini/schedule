"use client";

import { useEffect } from "react";
import axios from "axios";
import { useStore } from "@/store";
import { UseMeType } from "@/validations/validations";

export function useServices({user}: {user: UseMeType}) {
  const { services, setServices } = useStore((state) => ({
    services: state.services,
    setServices: state.setServices,
  }));

  async function getSchedules() {
    try {
      if(!user) return
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APIURL}/api/services/${user.id}`
      );
      setServices(response.data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    getSchedules();
  }, []);

  return { services, setServices };
}
