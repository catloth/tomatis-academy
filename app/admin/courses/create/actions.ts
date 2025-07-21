"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
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
        }
      } else {
        return {
          status: "error",
          message: "Você foi identificado como um robô! Caso isso tenha ocorrido por engano, entre em contato com o nosso suporte.",
        }
      }
    }
    
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "invalid data form",
      };
    }

    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.smallDescription,
      default_price_data: {
        currency: 'brl',
        unit_amount: validation.data.price * 100, // o valor é sempre em centavos
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string, // temporary work-around
        stripePriceId: data.default_price as string,
      },
    });

    return {
      status: "success",
      message: "O curso foi criado com sucesso!",
    }
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Ocorreu um erro ao criar o curso",
    }
  }
}