import { prismaClient } from "@/database/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: any, { params }: any) {
  const { id } = params;

  const services = await prismaClient.service.findMany({
    where: {
      userId: id,
    },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(services);
}

export async function DELETE(req: NextRequest, {params}: any) {
  const { id } = params;

  const serviceDeleted = await prismaClient.service.delete({
    where: { id: id },
  });

  if (!serviceDeleted) {
    return NextResponse.json(
      { message: "Não foi possível deletar!" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Deletado com sucesso!" },
    { status: 200 }
  );
}