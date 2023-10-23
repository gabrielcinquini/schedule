import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/database/client";

export async function GET(_: any, { params }: any) {

  const { id } = params;

  const schedules = await prismaClient.schedule.findMany({
    where: {
      userId: id,
    },
    include: {
      patient: true
    },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(schedules);
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;
  
  const orderDeleted = await prismaClient.schedule.delete({
    where: { id: id },
  });

  if (!orderDeleted) {
    return NextResponse.json(
      { message: "Não foi possível deletar essa consulta" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Consulta deletada com sucesso!" },
    { status: 200 }
  );
}
