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
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(128, { message: "Password is too long." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(128, { message: "Password is too long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "INVALID_TOKEN") {
      setTokenError(true);
    }
  }, [searchParams]);

  const handleResetPassword = async (data: z.infer<typeof formSchema>) => {
    const token = searchParams.get("token");

    if (!token) {
      form.setError("root", {
        message: "Invalid or missing reset token.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (response.data) {
        setIsSuccess(true);
        return;
      }

      if (response.error) {
        form.setError("root", {
          message:
            response.error.message ??
            "An error occurred while resetting your password. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-0">
          <CardHeader className="gap-1 text-left">
            <CardTitle className="text-2xl font-semibold">
              Invalid or expired link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request
              a new one.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Field>
              <Link href="/forgot-password" className="w-full">
                <Button type="button" className="w-full">
                  Request New Link
                </Button>
              </Link>
              <FieldDescription className="text-center">
                <Link
                  href="/signin"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Back to Sign In
                </Link>
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-0">
          <CardHeader className="gap-1 text-left">
            <CardTitle className="text-2xl font-semibold">
              Password reset successful
            </CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now sign in
              with your new password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Field>
              <Link href="/signin" className="w-full">
                <Button type="button" className="w-full">
                  Sign In
                </Button>
              </Link>
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
            Set new password
          </CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it&apos;s at least 6
            characters long.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleResetPassword)} noValidate>
            <FieldGroup>
              <div className="flex flex-col space-y-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-password">
                        New Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-confirm-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm your new password"
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
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                  <FieldDescription className="text-center">
                    <Link
                      href="/signin"
                      className="hover:text-primary underline underline-offset-4"
                    >
                      Back to Sign In
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
