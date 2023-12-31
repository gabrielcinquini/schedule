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
  const { schedules, services } = useStore((state) => ({
    schedules: state.schedules,
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

  return (
    <header className="border-y-2 gap-4 max-sm:h-1/6 w-full lg:py-6 lg:px-32 flex flex-col md:py-8 md:px-12 max-sm:py-2 max-sm:px-4">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold max-sm:text-xl">Dashboard</h1>
        <div className="flex gap-2 items-center">
          {currentPage !== "total" && title && (
            <Button
              className="max-sm:gap-0 w-fit max-sm:p-2"
              onClick={openModal}
            >
              {title}
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
      <div className="flex items-center justify-center gap-12 max-sm:gap-2">
        <CardInfo
          currentPage={currentPage}
          totalHome={calcularTotal(schedules)}
          totalReceived={calcularTotal(completedServices)}
          totalNotReceived={calcularTotal(incompleteServices)}
        />
      </div>
    </header>
  );
}
