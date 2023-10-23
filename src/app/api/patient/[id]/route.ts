import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/database/client";

export async function GET(_: any, { params }: any) {
  const { id } = await params;

  const patients = await prismaClient.patient.findMany({
    where: {
      userId: id,
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

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  const patientDeleted = await prismaClient.patient.delete({ where: { id: id } });

  if(!patientDeleted) {
    return NextResponse.json({message: "Não foi possível deletar esse paciente"}, {status: 400})
  }

  return NextResponse.json(
    { message: "Paciente deletado com sucesso!" },
    { status: 200 }
  );
}
