import { prismaClient } from "@/database/client";
import { forgotPasswordFormSchema } from "@/validations/validations";
import { compareSync, hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = forgotPasswordFormSchema.safeParse(body);

  if (!parsedBody.success)
    return NextResponse.json({ message: "Validation Error" }, { status: 404 });

  const { newPassword, confirmPassword, id } = parsedBody.data;
  if (!newPassword || !confirmPassword)
    return NextResponse.json(
      { message: "A senha deve ser inserida" },
      { status: 404 }
    );

  if (!id)
    return NextResponse.json(
      { message: "ID deve ser inserido" },
      { status: 404 }
    );

  const user = await prismaClient.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) return NextResponse.json({ message: "Usuário não encontrado" });

  if (compareSync(newPassword, user.password))
    return NextResponse.json(
      {
        message: "A senha não pode ser a mesma já cadastrada",
      },
      { status: 404 }
    );

  const updatedUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashSync(newPassword, 10),
    },
  });

  return NextResponse.json({ message: "Senha alterada com sucesso" });
}