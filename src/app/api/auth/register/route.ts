import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";

import { prismaClient } from "@/database/client";
import { registerUserFormSchema } from "@/validations/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedBody = registerUserFormSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error);
  }

  const { username, password, fullname, email } = parsedBody.data;

  const userExists = await prismaClient.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    },
  });

  if (userExists) {
    return NextResponse.json(
      { message: "Usuário já cadastrado" },
      { status: 401 }
    );
  }

  await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashSync(password, 10),
      name: fullname,
    },
  });

  return NextResponse.json({ message: 'Usuário registrado com sucesso!' });
}
