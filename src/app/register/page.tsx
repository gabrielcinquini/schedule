"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  RegisterUserType,
  registerUserFormSchema,
} from "@/validations/validations";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/store";
import ModeToggle from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatName, formatUsername } from "@/utils/utils";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function Home() {
  const form = useForm<RegisterUserType>({
    mode: "all",
    resolver: zodResolver(registerUserFormSchema),
  });

  const router = useRouter();

  const handleRegister = async (
    user: Omit<RegisterUserType, "confirmPassword">
  ) => {
    try {
      const res = await axios.post("/api/register", user);

      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      router.push("/home");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Não foi possível conectar com o banco de dados");
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="absolute top-12">
        <ModeToggle />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-2 items-center"
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Usuário"
                    onChange={(e) => {
                      field.onChange(e);
                      formatUsername(e);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nome"
                    onChange={(e) => {
                      field.onChange(e);
                      formatName(e);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sobrenome"
                    onChange={(e) => {
                      field.onChange(e);
                      formatName(e);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Senha"
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
          <div className="flex flex-col gap-8 justify-evenly w-full">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader />
              )}
              Cadastrar
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href="/" className="flex gap-2 w-full">
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
