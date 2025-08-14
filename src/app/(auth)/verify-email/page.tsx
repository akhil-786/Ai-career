"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const handleResendEmail = async () => {
    setIsResending(true);
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        toast({
          title: "Verification Email Sent",
          description: "A new verification link has been sent to your email address.",
        });
      } catch (error: any) {
        toast({
          title: "Error Sending Verification Email",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsResending(false);
      }
    } else {
        toast({
          title: "Not Logged In",
          description: "Please log in to resend the verification email.",
          variant: "destructive",
        });
        router.push("/login");
        setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <MailCheck className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the
            link to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you've verified your email, you can log in to your account.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex-col text-center text-sm gap-2">
          <p>
            Didn&apos;t receive the email?{" "}
          </p>
           <Button variant="link" onClick={handleResendEmail} disabled={isResending}>
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Resend verification link
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
