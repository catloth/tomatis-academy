import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of carefully curated courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description: "Monitore seu progresso e suas conquistas com estatísticas detalhadas e um mural personalizados.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description: "Junte-se a uma comunidade vibrante de alunos e instrutores para colaboração e compartilhamento de conhecimento.",
    icon: "🙋🏻‍♂️",
  },];

export default function Home() {
  return (
    <>
    <section className="relative py-20">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="outline">
          O Futuro da Educação Online
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Eleve o nível de seu aprendizado</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">Descubra uma nova maneira de aprender com o nosso sistema de ensino moderno e interativo. Tenha acesso a cursos de alta-qualidade a qualquer hora e em qualquer lugar.</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            className={buttonVariants({size: "lg"})} 
            href="/courses"
          >
            Explore os cursos
          </Link>

          <Link 
            className={buttonVariants({
              size: "lg",
              variant: "outline",
            })} 
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
      {features.map((feature, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-4">{feature.icon}</div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
    </>
  );
}
