import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import Link from "next/link";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        <p className="text-muted-foreground">
          Aqui você pode ter acesso a todos os seus cursos
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="Nenhum curso"
          description="Você ainda não adquiriu nenhum curso"
          buttonText="Conheça os cursos"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.Course.id} data={course} />
          ))}
        </div>
      )}
      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Cursos disponíveis</h1>
          <p className="text-muted-foreground">
            Aqui você pode conhecer todos os cursos disponíveis para matrícula
          </p>
        </div>
        {
          // Cursos que o usuário ainda não comprou
          courses.filter(
            (course) =>
              !enrolledCourses.some(
                ({ Course: enrolled }) => enrolled.id === course.id
              )
          ).length === 0 ? (
            <EmptyState
              title="Nenhum curso disponível"
              description="Você já adquiriu todos os cursos disponíveis"
              buttonText="Conheça os cursos"
              href="/courses"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(
                  (course) =>
                    !enrolledCourses.some(
                      ({ Course: enrolled }) => enrolled.id === course.id
                    )
                )
                .map((course) => (
                  <PublicCourseCard
                    key={course.id}
                    data={course}
                  />
                ))}
            </div>
          )
        }
      </section>
    </>
  );
}
