import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";


interface iAppProps {
  params: Promise<{slug : string}>;
}

export default async function CourseSlugRoute({ params } : iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  const firstChapter = course.course.chapters[0];
  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  
  return (
    <div className="flex items-cetner justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">Não há aulas disponíveis</h2>
      <p className="text-muted-foreground">Este curso não possui nenhum aula ainda.</p>
    </div>
  )
}