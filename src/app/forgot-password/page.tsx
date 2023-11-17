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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function page() {

  const form = useForm<ForgotPasswordFormSchemaType>({
    mode: "all",
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const { user } = useMe();

  if (!user) return <p>Loading...</p>;

  const handleChangePassword = async (
    data: Omit<ForgotPasswordFormSchemaType, "confirmPassword">
  ) => {
    try {
      data.id = user.id;
      const res = await axios.post("/api/forgotPassword/", data);
      toast.success("Senha alterada com sucesso!");
      form.reset();
    } catch (err) {
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
      <Form {...form}>
        <form
          className="flex flex-col gap-2 items-center mt-8"
          onSubmit={form.handleSubmit(handleChangePassword)}
        >
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nova Senha"
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirmar Senha"
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col w-full gap-8">
            <Button
              type="submit"
              className="disabled:cursor-not-allowed disabled:opacity-50"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Enviar
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href="/home" className="flex gap-2 w-full">
                <ArrowLeftIcon />
                Voltar
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
