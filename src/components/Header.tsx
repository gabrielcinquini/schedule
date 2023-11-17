import { UseMeType } from "@/validations/validations";
import React from "react";
import CardInfo from "./CardInfo";
import { calcularTotal } from "@/utils/utils";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ModeToggle from "./ui/mode-toggle";

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

  const router = useRouter();

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
    <header className="border-y-2 max-sm:h-1/6 w-full lg:py-12 lg:px-32 flex flex-col md:py-8 md:px-12 max-sm:py-2 max-sm:px-4">
      <div className="flex justify-between gap-12 max-sm:gap-2">
        <div className="flex flex-col gap-8 max-sm:gap-4 items-center w-fit">
          {currentPage !== "total" && (
            <>
              <div className="flex flex-col items-center gap-1">
                <span>Olá {user.name}</span>
                <Button
                  className="max-sm:p-1"
                  variant={"outline"}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
              <Button
                className="max-sm:p-1"
                variant={"outline"}
                onClick={() => router.push("/forgot-password")}
              >
                Alterar Senha
              </Button>
            </>
          )}
        </div>
        <CardInfo
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
        <div className="flex gap-4 flex-col items-center">
          {currentPage !== "total" && (
            <Button className="max-sm:p-1" onClick={openModal}>
              {title}
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
