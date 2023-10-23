import { prismaClient } from "@/database/client";
import {
  patientSchema,
  registerPatientFormSchema,
} from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = registerPatientFormSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error });
  }

  const { name, lastName, cpf, convenio, userId } = parsedBody.data;

  const patient = await prismaClient.patient.findFirst({
    where: {
      cpf: cpf,
    },
  });

  if (patient) {
    return NextResponse.json(
      { message: "Paciente já cadastrado" },
      { status: 404 }
    );
  }

  const newPatient = await prismaClient.patient.create({
    data: {
      name: name,
      lastName: lastName,
      cpf: cpf,
      convenio: convenio,
      userId: userId,
    },
  });

  return NextResponse.json(newPatient);
}
