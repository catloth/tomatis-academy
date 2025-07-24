"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestRoute() {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  )
}

function VerifyRequest() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTranstion] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTranstion(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Endereço de email verificado!");
            router.push("/");
          },
          onError: () => {
            toast.error("Ocorreu um erro ao verificar seu endereço de email.");
          }
        }
      })
    })
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Por favor, verifique o seu email.</CardTitle>
        <CardDescription>Encaminhamos um código de verificação para o seu endereço de email. Por favor, abra o email e cole o código abaixo:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6} className="gap-2">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-center text-xs text-muted-foreground">
            Forneça o código de 6 dígitos enviado para o seu email.
          </p>
        </div>
        <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="w-full">
          {emailPending ? (
            <>
            <Loader2 className="size-4 animate-spin" />
            <span>Loading...</span>
            </>
          ) : (
            "Verificar Conta"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}