import React from "react";

type CardProps = {
  currentPage: string;
  totalHome?: string;
  totalReceived?: string;
  totalNotReceived?: string;
};

export default function Card({
  currentPage,
  totalHome,
  totalReceived,
  totalNotReceived,
}: CardProps) {
  return (
    <>
      {currentPage === "home" ? (
        <div className="lg:w-1/2 h-40 bg-green-600 p-4 rounded-xl md:w-1/3 max-sm:h-28">
          <div className="flex align-middle justify-center gap-6">
            <span className="border-b-2 w-full text-center lg:text-2xl md:text-xl">
              Total a Receber
            </span>
          </div>
          <span className="flex h-full justify-center items-center lg:text-4xl md:text-3xl max-sm:text-lg">
            {totalHome}
          </span>
        </div>
      ) : currentPage === "total" ? (
        // Content for total page goes here
        <div className="flex gap-6 w-full">
          <div className="lg:w-1/2 h-40 bg-green-600 p-4 rounded-xl md:w-1/2 max-sm:h-28">
            <div className="flex align-middle justify-center gap-6 lg:text-2xl md:text-xl">
              <span className="border-b-2 w-full text-center">
                Total Recebido
              </span>
            </div>
            <span className="flex h-full justify-center items-center lg:text-4xl md:text-3xl max-sm:text-lg">
              {totalReceived}
            </span>
          </div>
          <div className="h-40 bg-red-600 p-4 rounded-xl md:w-1/2 max-sm:h-28">
            <div className="flex align-middle justify-center gap-6 lg:text-2xl md:text-xl">
              <span className="border-b-2 w-full text-center">
                Total Perdido
              </span>
            </div>
            <span className="flex h-full justify-center items-center lg:text-4xl md:text-3xl max-sm:text-lg">
              {totalNotReceived}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
