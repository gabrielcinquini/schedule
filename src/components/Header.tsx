import { UseMeType } from "@/validations/validations";
import React from "react";
import Card from "./Card";
import { calcularTotal } from "@/utils/utils";
import { useSchedules } from "@/hooks/useSchedules";
import { useServices } from "@/hooks/useServices";
import { useStore } from "@/store";

type HeaderType = {
  user: UseMeType;
  openModal?: () => void;
  title?: string;
  currentPage: string;
};

export default function Header({
  user,
  openModal,
  title,
  currentPage,
}: HeaderType) {
  const { schedules, setSchedules, services } = useStore((state) => ({
    schedules: state.schedules,
    setSchedules: state.setSchedules,
    services: state.services,
  }));
  if (!schedules || !services) return <p>Loading...</p>;

  const completedServices = services.filter(
    (service) => service.isComplete === true
  );
  const incompleteServices = services.filter(
    (service) => service.isComplete === false
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="bg-purple-900 h-1/4 w-full lg:py-12 lg:px-32 flex flex-col md:py-8 md:px-12 max-sm:py-2 max-sm:px-4">
      <div className="flex justify-between">
        <span>
          Olá {user.name}
          <button
            className="ml-4 bg-slate-900 p-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </span>
        <Card
          currentPage={currentPage}
          totalHome={new Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(calcularTotal(schedules))}
          totalReceived={new Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(calcularTotal(completedServices))}
          totalNotReceived={new Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(calcularTotal(incompleteServices))}
        />
        {currentPage !== "total" && (
          <button
            className="bg-purple-800 px-4 py-2 rounded-md border-none h-min md:px-2 md:py-2 max-sm:px-2"
            onClick={openModal}
          >
            {title}
          </button>
        )}
      </div>
    </header>
  );
}
