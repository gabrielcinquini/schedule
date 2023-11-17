import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function Nav() {
  return (
    <nav className="flex gap-2 justify-between p-2">
      <Button asChild variant={"secondary"}>
        <Link href="/home">
          Agenda
        </Link>
      </Button>
      <Button variant={"secondary"} asChild>
        <Link href="/home/cadastro">
          Pacientes
        </Link>
      </Button>
      <Button variant={"secondary"} asChild>
        <Link href="/home/total">
          Total
        </Link>
      </Button>
    </nav>
  );
}
