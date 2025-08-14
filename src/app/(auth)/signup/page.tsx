
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Linkedin, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one letter, one number, and one special character."}),
});

const PasswordStrength = ({ password = '' }: { password?: string }) => {
    const checks = useMemo(() => {
        return [
            { label: "At least 8 characters", valid: password.length >= 8 },
            { label: "Contains a letter", valid: /[a-zA-Z]/.test(password) },
            { label: "Contains a number", valid: /\d/.test(password) },
            { label: "Contains a special character (@$!%*?&)", valid: /[@$!%*?&]/.test(password) }
        ];
    }, [password]);

    const strength = checks.filter(c => c.valid).length;

    if (!password) return null;

    return (
        <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-muted rounded-full">
                    <div className={cn("h-full rounded-full transition-all", 
                        strength === 0 && "w-0",
                        strength === 1 && "w-1/4 bg-red-500",
                        strength === 2 && "w-2/4 bg-yellow-500",
                        strength === 3 && "w-3/4 bg-blue-500",
                        strength === 4 && "w-full bg-green-500",
                    )}></div>
                </div>
                <p className="text-xs font-medium">
                    {strength < 2 && "Weak"}
                    {strength === 2 && "Medium"}
                    {strength === 3 && "Strong"}
                    {strength === 4 && "Very Strong"}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {checks.map(check => (
                    <div key={check.label} className={cn("flex items-center text-xs gap-1.5", check.valid ? "text-green-600" : "text-muted-foreground")}>
                        {check.valid ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {check.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched"
  });

  const password = useWatch({ control: form.control, name: 'password' });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);

      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
      });

      toast({
        title: "Account Created",
        description: "A verification email has been sent. Please check your inbox.",
      });
      router.push("/verify-email");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to start your journey with CareerWise AI
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    <PasswordStrength password={field.value} />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline ml-1">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
