"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    // Access request data that Arcjet needs when you call `protect()` similarly
    // to `await headers()` and `await cookies()` in `next/headers`
    const req = await request();

    // Call Arcjet protect
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Você foi bloqueado devido ao limitador de taxa.",
        };
      } else {
        return {
          status: "error",
          message:
            "Você foi identificado como um robô! Caso isso tenha ocorrido por engano, entre em contato com o nosso suporte.",
        };
      }
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "O curso foi apagado com sucesso!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Ocorreu um erro ao apagar o curso",
    };
  }
}
