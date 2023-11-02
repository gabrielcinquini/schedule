"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { formatUsername } from "@/utils/utils";
import { LoginUserType, loginUserFormSchema } from "@/validations/validations";
import ErrorMessage from "@/components/ErrorMessage";
import { useStore } from "@/store";

export default function Home() {
  const { pending, setPending } = useStore((state) => ({
    pending: state.pending,
    setPending: state.setPending,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserType>({
    mode: "onChange",
    resolver: zodResolver(loginUserFormSchema),
  });

  const router = useRouter();

  const handleLogin = async (data: LoginUserType) => {
    try {
      setPending(true);
      const response = await axios.post("/api/login", {
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) {
        router.push("/home");
        const token = response.data.accessToken;

        localStorage.setItem("token", token);
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      // @ts-expect-error
      if (error instanceof AxiosError && error.response.status === 404) {
        toast.error("Credenciais não encontradas");
      } else {
        toast.error("Não foi possível conectar ao banco de dados");
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={handleSubmit(handleLogin)}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Usuário"
          {...register("username", {
            onChange: formatUsername,
          })}
          autoComplete="off"
        />
        {errors.username && <ErrorMessage message={errors.username.message} />}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Senha"
          {...register("password")}
          autoComplete="off"
        />
        {errors.password && <ErrorMessage message={errors.password.message} />}
        <div className="flex w-full justify-between">
          {pending ? (
            <input
              className="text-white px-6 py-2 rounded-xl bg-lime-600 w-fit hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              value="Enviando..."
              disabled={true}
            />
          ) : (
            <input
              className="text-white px-6 py-2 rounded-xl bg-lime-600 w-fit hover:cursor-pointer"
              type="submit"
              value="Enviar"
            />
          )}
          <Link
            href="/register"
            className="text-white bg-teal-950 px-6 py-2 rounded-xl"
          >
            Cadastrar
          </Link>
        </div>
      </form>
    </div>
  );
}
