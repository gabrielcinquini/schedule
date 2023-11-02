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
  } = useForm<RegisterUserType>({
    mode: "all",
    resolver: zodResolver(registerUserFormSchema),
  });

  const router = useRouter();

  const handleRegister = async (
    user: Omit<RegisterUserType, "confirmPassword">
  ) => {
    try {
      setPending(true);
      const res = await axios.post("/api/register", user);

      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      router.push("/home");
      setPending(false);
    } catch (err) {
      setPending(false);
      if (err instanceof AxiosError) {
        console.error(err);
      } else {
        toast.error("Não foi possível conectar com o banco de dados");
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={handleSubmit(handleRegister)}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Usuário"
          {...register("username")}
          autoComplete="off"
        />
        {errors.username && <ErrorMessage message={errors.username.message} />}
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Nome"
          {...register("name")}
          autoComplete="off"
        />
        {errors.name && <ErrorMessage message={errors.name.message} />}
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Sobrenome"
          {...register("lastName")}
          autoComplete="off"
        />
        {errors.lastName && <ErrorMessage message={errors.lastName.message} />}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Senha"
          {...register("password")}
        />
        {errors.password && <ErrorMessage message={errors.password.message} />}
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
            value="Cadastrar"
          />
        )}
      </form>
    </div>
  );
}
