"use client";

import { useEffect } from "react";
import axios from "axios";
import {
  PatientType, UseMeType,
} from "@/validations/validations";
import { useStore } from "@/store";

export function usePatients({user}: {user: UseMeType}) {
  const { patients, setPatients } = useStore((state) => ({
    patients: state.patients,
    setPatients: state.setPatients,
  }));

  async function getPatients() {
    try {
      if (!user) return;
      const response = await axios.get<PatientType[]>(
        `${process.env.NEXT_PUBLIC_APIURL}/api/patient/${user.id}`
      );
      setPatients(response.data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  return { patients, setPatients };
}
