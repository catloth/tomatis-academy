import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
      github: {
        clientId: env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,
      }
    },
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await resend.emails.send({
            // Se não validar o seu próprio domínio com a resend você só pode mandar emails
            // para si mesmo (email cadastrado com a resend) atraves deste endereço:
            // onboarding@resend.dev
            from: 'Tomatis Academy <onboarding@resend.dev>',
            to: [email],
            subject: 'Verificação do endereço de email utilizado para acessar a Tomatis Academy',
            html: `<p>Seu código OTP é <strong>${otp}</strong></p>`,
          });
        },
      }),
      admin(),
    ],
})