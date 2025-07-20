"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>(); // Possibilita obter parâmetros no lado do cliente.
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("Um erro inesperado ocorreu. Por favor, tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Você tem certeza que deseja apagar este curso?</CardTitle>
          <CardDescription>
            Ao confirmar esta ação, ela não poderá ser desfeita.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            Cancelar
          </Link>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Apagando...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Apagar
              </>
            )}

          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
