import { prismaClient } from "@/database/client";
import {
  registerToScheduleFormSchema,
  schedulePostSchema,
  scheduleSchema,
} from "@/validations/validations";
import { NextRequest, NextResponse } from "next/server";
import { addMinutes, subMinutes } from "date-fns";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedBody = schedulePostSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error }, { status: 404 });
  }

  const { date, value, userId, patientId, name, lastName } = parsedBody.data;

  // return NextResponse.json({
  //   date: date,
  //   start: subMinutes(date, 39),
  //   end: addMinutes(date, 39),
  //   data: new Date('2023-11-17'),
  //   dataHj: new Date()
  // });
  

  const startDate = subMinutes(date, 39);
  const endDate = addMinutes(date, 39);

  const existingSchedule = await prismaClient.schedule.findFirst({
    where: {
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

  const schedule = await prismaClient.schedule.create({
    data: {
      name: name,
      lastName: lastName,
      value: value,
      date: date,
      userId: userId,
      patientId: patientId,
    },
  });

  return NextResponse.json({schedule, startDate, endDate});
}
