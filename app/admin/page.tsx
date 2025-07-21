import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";

import { requireAdmin } from "../data/admin/require-admin";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  //const session = await requireAdmin();

  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4 ">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cursos recentes</h2>
          <Link className={buttonVariants({variant: "outline"})} href="/admin/courses">Ver todos os cursos</Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeleton />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState buttonText="Criar um novo curso" description="Você ainda não criou nenhum curso. Crie algum para visualizá-lo aqui." title="Você ainda não criou nenhum curso" href="/admin/courses/create" />  
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course)=> (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  )
}

function RenderRecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({length: 2}).map((_, index) => (<AdminCourseCardSkeleton key={index} />))}
    </div>
  )
}