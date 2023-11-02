"use client";

import ErrorMessage from "@/components/ErrorMessage";
import { useMe } from "@/hooks/useMe";
import {
  ForgotPasswordFormSchemaType,
  forgotPasswordFormSchema,
} from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

export default function page() {
  const { pending, setPending } = useStore((state) => ({
    pending: state.pending,
    setPending: state.setPending,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormSchemaType>({
    mode: "all",
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const router = useRouter();
  const { user } = useMe();

  if (!user) return <p>Loading...</p>;

  const handleChangePassword = async (
    data: Omit<ForgotPasswordFormSchemaType, "confirmPassword">
  ) => {
    try {
      setPending(true);
      data.id = user.id;
      const res = await axios.post("/api/forgotPassword/", data);
      toast.success("Senha alterada com sucesso!");
      reset();
      setPending(false);
    } catch (err) {
      setPending(false);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Ocorreu algum erro inesperado");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1>Olá {user.name}</h1>
      <form
        className="flex flex-col gap-2 items-center text-gray-800 mt-8"
        onSubmit={handleSubmit(handleChangePassword)}
      >
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Nova Senha"
          {...register("newPassword")}
          autoComplete="off"
        />
        {errors.newPassword && (
          <ErrorMessage message={errors.newPassword.message} />
        )}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Confirmar Senha"
          {...register("confirmPassword")}
          autoComplete="off"
        />
        {errors.confirmPassword && (
          <ErrorMessage message={errors.confirmPassword.message} />
        )}
        <div className="flex flex-col w-full gap-12">
          {pending ? <input
            className="text-white px-6 py-2 w-full rounded-xl bg-lime-600 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            value="Enviando..."
            disabled={true}
          /> : <input
          className="text-white px-6 py-2 w-full rounded-xl bg-lime-600 hover:cursor-pointer"
          type="submit"
        />}
          <button
            className="text-white px-6 py-2 w-full rounded-xl bg-slate-700 hover:cursor-pointer"
            onClick={() => router.push("/home")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
