import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = {
  currentPage: string;
  totalHome?: string;
  totalReceived?: string;
  totalNotReceived?: string;
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
            <h1 className="text-2xl max-sm:text-lg">{totalHome}</h1>
          </CardContent>
        </Card>
      ) : currentPage === "total" ? (
        <>
          <Card className="bg-green-600">
            <CardHeader>
              <CardTitle>Total Recebido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg">{totalReceived}</h1>
            </CardContent>
          </Card>
          <Card className="bg-red-600">
            <CardHeader>
              <CardTitle>Total Perdido</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <h1 className="text-2xl max-sm:text-lg">{totalNotReceived}</h1>
            </CardContent>
          </Card>
        </>
      ) : null}
    </>
  );
}
