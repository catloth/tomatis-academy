"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { MarkLessonComplete } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Essa aula ainda não tem um vídeo.
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        >
          <source
            src={videoUrl}
            type="video/mp4"
          />
          <source
            src={videoUrl}
            type="video/webm"
          />
          <source
            src={videoUrl}
            type="video/ogg"
          />
          O seu navegador não tem suporte a tag video.
        </video>
      </div>
    );
  }

  //
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.Chapter.Course.slug)
      );

      if (error) {
        toast.error("Um erro inesperado ocorreu. Por favor, tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button variant="outline" className="bg-green-500/10 text-green-500 hover:text-green-500">
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Concluído
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onSubmit}
            disabled={pending}
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Marcar como Concluído
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3 ">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
