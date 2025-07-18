import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Acesso restrito</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            Hey! Aparentemente, você não é um administrador. Isto significa que você não pode criar cursos nem tarefas administrativas.
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto">
          <Link href="/" className={buttonVariants()}>
            <ArrowLeft className="mr-1 size-4" />
            Voltar ao início
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}