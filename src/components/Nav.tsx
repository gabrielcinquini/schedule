import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseMeType } from "@/validations/validations";
import { useRouter } from "next/navigation";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export default function Nav({ user }: { user: UseMeType }) {
  const router = useRouter();

  return (
    <header className="flex gap-2 py-2 justify-between">
      <div className="flex gap-2">
        <Button asChild variant={"link"}>
          <Link href="/home">Agenda</Link>
        </Button>
        <Button variant={"link"} asChild>
          <Link href="/home/cadastro">Pacientes</Link>
        </Button>
        <Button variant={"link"} asChild>
          <Link href="/home/total">Total</Link>
        </Button>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <Avatar>
                <AvatarImage src="" alt="" />
                <AvatarFallback>
                  {user.name.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            <Button
              className="max-sm:p-1"
              variant={"secondary"}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              className="max-sm:p-2 max-sm:h-10 flex gap-1 max-sm:gap-0"
              variant={"secondary"}
              onClick={() => router.push("/forgot-password")}
            >
              Alterar Senha
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
