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

  if (isComplete) {
    await prismaClient.patient.update({
      where: {
        id: patientId,
      },
      data: {
        lastConsult: new Date(),
      },
    });
  }

  const service = await prismaClient.service.create({
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

  return NextResponse.json({ message: parsedBody.data });
}
