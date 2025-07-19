import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Desenvolvimento",
  "Negócios",
  "Finanças",
  "IT & Software",
  "Produtividade",
  "Desenvolvimento Pessoal",
  "Design",
  "Marketing",
  "Saúde e Cuidado Pessoal",
  "Música",
  "Ensino e Pesquisa"
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(8, {message: "O nome do curso deve ter pelo menos 8 caracteres."})
    .max(128, {message: "O nome do curso deve ter o máximo 128 caracteres."}),
  description: z
    .string()
    .min(8, {message: "A descrição do curso deve ter pelo menos 8 caracteres."}),

  fileKey: z
    .string()
    .min(1, {message: "É obrigatório fornecer um arquivo."}),
  
  price: z
    .coerce
    .number()
    .min(1, {
      message: "O preço deve conter um valor positivo."
    }),

  duration: z
    .coerce
    .number()
    .min(1, {message: "A duração mínima deve ser de, pelo menos, 1 hora."})
    .max(512, {message: "A duração méxima deve ser de, no máximo, 512 horas."}),

  level: z
    .enum(courseLevels, {message: "É obrigatório atribuir um nível de dificuldade a curso."}),
  category: z.enum(courseCategories, {message: "É obrigatório definir uma categoria para o curso."}),
  smallDescription: z
    .string()
    .min(8, {message: "A descrição simplificada deve conter no mínimo 8 caracteres."})
    .max(256, {message: "A descrição resumida deve conter no máximo 256 caracteres."}),

  slug: z.string().min(8, {message: "Slug deve conter, pelo menos, 8 caracteres."}),

  status: z
    .enum(courseStatus, {message: "É necessário atribuir um status ao curso."})
})

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve conter pelo menos 3 caracteres."} ),
  courseId: z.string().uuid({ message: "O identificador do curso é inválido."}),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve conter pelo menos 3 caracteres."} ),
  courseId: z.string().uuid({ message: "O identificador do curso é inválido."}),
  chapterId: z.string().uuid({ message: "O identificador do módulo é inválido."}),
  description: z.string().min(3, {message: "A descrição deve conter pelo menos 3 caracteres."}).optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),

});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;