"use client";

import "react-toastify/dist/ReactToastify.css";

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
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormSchemaType>({
    mode: "all",
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const router = useRouter()
  const { user } = useMe();

  if (!user) return <p>Loading...</p>;

  const handleChangePassword = async (
    data: Omit<ForgotPasswordFormSchemaType, "confirmPassword">
  ) => {
    try {
      data.id = user.id;
      const res = await axios.post("/api/forgotPassword/", data);
      toast.success("Senha alterada com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      reset();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Ocorreu algum erro inesperado", {
          position: toast.POSITION.TOP_RIGHT,
        });
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
          <input
            className="text-white px-6 py-2 w-full rounded-xl bg-lime-600 hover:cursor-pointer"
            type="submit"
          />
          <button className="text-white px-6 py-2 w-full rounded-xl bg-slate-700 hover:cursor-pointer" onClick={() => router.push('/home')}>
            Voltar
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
