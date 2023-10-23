import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { prismaClient } from "@/database/client";
import { formatName } from "@/utils/utils";
import { registerUserFormSchema } from "@/validations/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedBody = registerUserFormSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error);
  }

  const { username, password, name, lastName } = parsedBody.data;

  const userNameExists = await prismaClient.user.findFirst({
    where: { username: username },
  });

  if (userNameExists) {
    return NextResponse.json(
      { message: "Usuário já cadastrado" },
      { status: 401 }
    );
  }

  const user = await prismaClient.user.create({
    data: {
      username: username,
      password: hashSync(password, 10),
      name: name,
      lastName: lastName
    },
  });

  const accessToken = sign({ sub: user.id }, "SUPER_SECRET", {
    expiresIn: "1d",
  });

  return NextResponse.json({ accessToken });
}
