import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonForm } from "./_components/LessonForm";

// In Next.JS 15 the params are async, you have to wait for them.
// That is the reason why we added a promise right here.
type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonIdPage({params}: {params: Params}) {
  const {chapterId, courseId, lessonId} = await params;
  const lesson = await adminGetLesson(lessonId);

  return (
    <LessonForm chapterId={chapterId} data={lesson} courseId={courseId} />
  )
}