"use client";

import { useMe } from "@/hooks/useMe";
import {
  ForgotPasswordFormSchemaType,
  forgotPasswordFormSchema,
} from "@/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Eye, EyeOff } from "lucide-react";

export default function page() {

  const form = useForm<ForgotPasswordFormSchemaType>({
    mode: "all",
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const [visibility, setVisibility] = useState(false)

  const { user } = useMe();
  
  if (!user) return <p>Loading...</p>;
  
  const handleChangeVisibility = () => {
    setVisibility((currentState) => !currentState)
  }

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
          <div className="relative">
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                      <Input
                        type={visibility ? 'text' : 'password'}
                        placeholder="Nova Senha"
                        onChange={field.onChange}
                        autoComplete="off"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="button" onClick={handleChangeVisibility} className="absolute top-2 right-2">{visibility ? <Eye /> : <EyeOff />}</button>
          </div>
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
