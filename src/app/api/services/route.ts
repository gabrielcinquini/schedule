import { prismaClient } from "@/database/client";
import { serviceFormSchema } from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = serviceFormSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 });
  }

  const { name, lastName, date, value, isComplete, userId, patientId } =
    parsedBody.data;

  // if (date > new Date())
  //   return NextResponse.json(
  //     { message: "Não é possível você já ter realizado essa consulta" },
  //     { status: 401 }
  //   );

  await prismaClient.service.create({
    data: {
      name: name,
      lastName: lastName,
      date: date,
      value: value,
      isComplete: isComplete,
      userId: userId,
      patientId: patientId,
    },
  });

  if (isComplete) {
    //atualizar o paciente para a última data de consulta realizada
    const services = await prismaClient.service.findMany({
      where: {
        patientId: patientId,
      },
    });
    const maxDateService = services.reduce((maxService, currentService) => {
      return currentService.date > maxService.date
        ? currentService
        : maxService;
    }, services[0]);

    await prismaClient.patient.update({
      where: {
        id: patientId,
      },
      data: {
        lastConsult: maxDateService.date,
      },
    });
  }

  return NextResponse.json({ message: "Movido para serviços com sucesso" });
}