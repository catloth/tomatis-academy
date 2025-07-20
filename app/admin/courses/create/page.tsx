"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchemas";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useConfetti } from "@/hooks/use-confetti";

export default function CourseCreationPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {triggerConfetti} = useConfetti();

  // 1. Define your form.
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "Saúde e Cuidado Pessoal",
      status: "Draft",
      slug: "",
      smallDescription: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error("Um erro inesperado ocorreu. Por favor, tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Crie um curso</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações básicas</CardTitle>
          <CardDescription>
            Forneça as informações gerais sobre o curso que está criando.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do curso"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const titleValue = form.getValues("title");
                    const slug = slugify(titleValue);
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Gerar Slug{" "}
                  <SparkleIcon
                    className="ml-1"
                    size={16}
                  />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Descrição resumida</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição resumida"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Descrição completa</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Imagem de capa</FormLabel>
                    <FormControl>
                      <Uploader
                        fileTypeAccepted="image"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Dificuldade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um nível de complexidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevels.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Duração (em horas)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Duração"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Preço (em reais)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Preço"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Creating...
                    <Loader2 className="animate-spin m-1" />
                  </>
                ) : (
                  <>
                    Criar curso{" "}
                    <PlusIcon
                      className="ml-1"
                      size={16}
                    />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
