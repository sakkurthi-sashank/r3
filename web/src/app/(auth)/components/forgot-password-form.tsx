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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(256, { message: "Email is too long." })
    .email("Invalid email."),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (response.data) {
        setIsSuccess(true);
        return;
      }

      if (response.error) {
        form.setError("root", {
          message:
            response.error.message ??
            "An error occurred while sending the reset email. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-0">
          <CardHeader className="gap-1 text-left">
            <CardTitle className="text-2xl font-semibold">
              Check your email
            </CardTitle>
            <CardDescription>
              If an account exists with this email address, we&apos;ve sent a
              password reset link. Please check your inbox and follow the
              instructions to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Field>
              <Link href="/signin" className="w-full">
                <Button type="button" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
              <FieldDescription className="text-center">
                Didn&apos;t receive the email?{" "}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="hover:text-primary underline underline-offset-4"
                >
                  Try again
                </button>
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0">
        <CardHeader className="gap-1 text-left">
          <CardTitle className="text-2xl font-semibold">
            Reset your password
          </CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleForgotPassword)} noValidate>
            <FieldGroup>
              <div className="flex flex-col space-y-3">
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

                {form.formState.errors.root && (
                  <FieldError
                    className="text-center"
                    errors={[form.formState.errors.root]}
                  />
                )}

                <Field>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <FieldDescription className="text-center">
                    Remember your password?{" "}
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
