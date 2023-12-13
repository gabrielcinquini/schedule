import { prismaClient } from "@/database/client";
import { registerPatientFormSchema } from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = registerPatientFormSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error });
  }

  const { name, lastName, cpf, convenio, userId } = parsedBody.data;

  const cryptCPF = CryptoJS.AES.encrypt(cpf, process.env.C_KEY).toString();

  const bytes = CryptoJS.AES.decrypt(cryptCPF, process.env.C_KEY);
  const originalCPF = bytes.toString(CryptoJS.enc.Utf8);

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: userId,
    },
  });

  const patientRegistered = patients.filter((patient) => {
    const bytes = CryptoJS.AES.decrypt(patient.cpf, process.env.C_KEY);
    const originalPatientCPF = bytes.toString(CryptoJS.enc.Utf8);
    return originalCPF === originalPatientCPF;
  });

  if (patientRegistered.length > 0) {
    return NextResponse.json(
      { message: "Paciente já cadastrado" },
      { status: 404 }
    );
  }

  const newPatient = await prismaClient.patient.create({
    data: {
      name: name,
      lastName: lastName,
      cpf: cryptCPF,
      convenio: convenio,
      userId: userId,
    },
  });

  newPatient.cpf = cpf;

  return NextResponse.json(newPatient);
}