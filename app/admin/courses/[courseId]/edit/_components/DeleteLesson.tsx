import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "../actions";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";


export function DeleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson({ chapterId, courseId, lessonId })
      );

      if (error) {
        toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      }  else if (result.status === "error") {
        toast.error(result.message);
      }

    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>Ao apagar a aula esta ação não poderá ser desfeita.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={onSubmit} disabled={pending}>
            {pending ? "Apagando...": "Apagar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}