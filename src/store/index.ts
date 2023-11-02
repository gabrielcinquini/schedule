import {
  PatientType,
  ScheduleType,
  ServiceSchemaType,
  UseMeType,
} from "@/validations/validations";
import { create } from "zustand";

type State = {
  user: UseMeType | null;
  schedules: ScheduleType[];
  patients: PatientType[];
  services: ServiceSchemaType[];
  pending: boolean;
};

type Actions = {
  setUser: (user: UseMeType) => void;
  setSchedules: (schedules: ScheduleType[]) => void;
  setPatients: (patients: PatientType[]) => void;
  setServices: (patients: ServiceSchemaType[]) => void;
  setPending: (pending: boolean) => void;
};

const initialState: State = {
  user: null,
  schedules: [],
  patients: [],
  services: [],
  pending: false,
};

export const useStore = create<State & Actions>((set, get) => {
  return {
    ...initialState,
    setUser: (user) => set({ user: user }),
    setSchedules: (schedule) => set({ schedules: schedule }),
    setPatients: (patient) => set({ patients: patient }),
    setServices: (services) => set({ services: services }),
    setPending: (pending) => set({ pending: pending }),
  };
});
