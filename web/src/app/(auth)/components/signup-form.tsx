"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { GoogleIcon } from "@/components/ui/icons/google";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import React from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(128, { message: "Name is too long." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .max(256, { message: "Email is too long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(128, { message: "Password is too long." }),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: env.NEXT_PUBLIC_BASE_URL,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: env.NEXT_PUBLIC_BASE_URL,
      });

      if (response.data?.user) {
        // Redirect to verify email page if email verification is required
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }

      if (response.error) {
        form.setError("root", {
          message:
            response.error.message ??
            "An error occurred during sign up. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0">
        <CardHeader className="gap-1 text-left">
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>Use your Google account to sign up</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSignUp)} noValidate>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={signUpWithGoogle}
                  className="flex w-full items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <div className="flex flex-col space-y-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-name">Full Name</FieldLabel>
                      <Input
                        {...field}
                        id="form-name"
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your name"
                        autoComplete="name"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-email">
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="example@email.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {form.formState.errors.root && (
                  <FieldError
                    className="text-center"
                    errors={[form.formState.errors.root]}
                  />
                )}

                <Field>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="hover:text-primary underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
