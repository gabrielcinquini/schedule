import { prismaClient } from "@/database/client";
import { registerPatientFormSchema } from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession()

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
    }
  })

  if(!userFromEmail) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: userFromEmail.id,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  const body = await req.json();
  const parsedBody = registerPatientFormSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error });
  }

  const { name, lastName, convenio } = parsedBody.data;

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
    }
  })

  if(!userFromEmail) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: userFromEmail?.id,
    },
  });

  const patientRegistered = patients.find((patient) => {
    patient.userId === userFromEmail.id; 
  });

  if (patientRegistered) {
    return NextResponse.json(
      { message: "Paciente já cadastrado" },
      { status: 404 }
    );
  }

  await prismaClient.patient.create({
    data: {
      name: name,
      lastName: lastName,
      convenio: convenio,
      userId: userFromEmail.id,
    },
  });

  return NextResponse.json({message: 'Paciente cadastrado com sucesso!'}, {status: 201});
}
