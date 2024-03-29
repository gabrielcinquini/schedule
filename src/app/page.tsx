"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { formatUsername } from "@/utils/utils";
import { LoginUserType, loginUserFormSchema } from "@/validations/validations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ModeToggle from "@/components/ui/mode-toggle";
import Loader from "@/components/Loader";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const form = useForm<LoginUserType>({
    mode: "onChange",
    resolver: zodResolver(loginUserFormSchema),
  });

  const [visibility, setVisibility] = useState(false)

  const router = useRouter();

  const handleLogin = async (data: LoginUserType) => {
    try {
      const response = await axios.post("/api/login", {
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) {
        router.push("/home");
        const token = response.data.accessToken;

        localStorage.setItem("token", token);
      }
    } catch (error) {
      // @ts-expect-error
      if (error instanceof AxiosError && error.response.status === 404) {
        toast.error("Credenciais não encontradas");
      } else {
        toast.error("Não foi possível conectar ao banco de dados");
      }
    }
  };

  const handleChangeVisibility = () => {
    setVisibility((currentState) => !currentState)
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="absolute top-12">
        <ModeToggle />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(handleLogin)}
        >
          <div>
            <Label htmlFor="username">Usuário</Label>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Usuário"
                      {...field}
                      onChange={(event) => {
                        formatUsername(event);
                        field.onChange(event);
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <Input
                          type={visibility ? 'text' : 'password'}
                          placeholder="Senha"
                          {...field}
                          onChange={(event) => {
                            field.onChange(event);
                          }}
                          autoComplete="off"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="button" onClick={handleChangeVisibility} className="absolute top-2 right-2">{visibility ? <Eye /> : <EyeOff />}</button>
            </div>
          <div className="flex w-full justify-between flex-col gap-8">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Enviar
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
