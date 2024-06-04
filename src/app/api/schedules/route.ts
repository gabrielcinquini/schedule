import { prismaClient } from "@/database/client";
import {
  createScheduleSchema,
} from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";
import { addMinutes, subMinutes } from "date-fns";
import { getServerSession } from "next-auth";
import { ScheduleStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const url = new URL(req.url);
  const status = url.searchParams.get('status') as ScheduleStatus;

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
    }
  })

  if(!userFromEmail) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

  const schedules = await prismaClient.schedule.findMany({
    where: {
      AND: [
        {
          userId: userFromEmail.id,
        },
        {
          status: status,
        }
      ]
    },
    include: {
      patient: true
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  const body = await req.json();

  const parsedBody = createScheduleSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 });
  }

  const { date, value, patientId, name, lastName } = parsedBody.data;

  const userFromEmail = await prismaClient.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    select: {
      id: true,
    }
  })

  if(!userFromEmail) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

  const startDate = subMinutes(date, 39);
  const endDate = addMinutes(date, 39);

  const existingSchedule = await prismaClient.schedule.findFirst({
    where: {
      userId: userFromEmail.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (existingSchedule) {
    return NextResponse.json(
      { message: "Já existe um agendamento para este horário." },
      { status: 400 }
    );
  }

  await prismaClient.schedule.create({
    data: {
      name: name,
      lastName: lastName,
      date: date,
      value: value,
      status: "PENDING",
      userId: userFromEmail.id,
      patientId: patientId,
    },
  });

  return NextResponse.json({ message: 'Agendamento de consulta realizado com sucesso!' }, { status: 201 });
}