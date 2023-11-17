import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountUp from 'react-countup';

type CardProps = {
  currentPage: string;
  totalHome: number;
  totalReceived: number;
  totalNotReceived: number;
};

export default function CardInfo({
  currentPage,
  totalHome,
  totalReceived,
  totalNotReceived,
}: CardProps) {
  return (
    <>
      {currentPage === "home" ? (
        <Card className="bg-green-600 max-sm:w-fit">
          <CardHeader>
            <CardTitle>Total a Receber</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <h1 className="text-2xl max-sm:text-lg"><CountUp end={totalHome} duration={2} prefix="R$ " decimal="," decimals={2}/></h1>
          </CardContent>
        </Card>
      ) : currentPage === "total" ? (
        <>
          <Card className="bg-green-600">
            <CardHeader>
              <CardTitle>Total Recebido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg"><CountUp end={totalReceived} duration={2} prefix="R$ " decimal="," decimals={2}/></h1>
            </CardContent>
          </Card>
          <Card className="bg-red-600">
            <CardHeader>
              <CardTitle>Total Perdido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg"><CountUp end={totalNotReceived} duration={2} prefix="R$ " decimal="," decimals={2}/></h1>
            </CardContent>
          </Card>
        </>
      ) : null}
    </>
  );
}
