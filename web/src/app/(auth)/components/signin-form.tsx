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
import { createAuthClient } from "better-auth/client";
import { GoogleIcon } from "@/components/ui/icons/google";
import { env } from "@/env";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(256, { message: "Invalid Email or password." })
    .email("Invalid email."),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .max(128, { message: "Invalid Email or password." }),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const authClient = createAuthClient();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: env.NEXT_PUBLIC_BASE_URL,
    });
  };

  const signInWithEmail = async (data: z.infer<typeof formSchema>) => {
    const response = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: env.NEXT_PUBLIC_BASE_URL,
      rememberMe: true,
    });

    if (response.data?.user) {
      router.push("/");
      return;
    }

    if (response.error) {
      form.setError("root", {
        message:
          response.error.message ??
          "An error occurred during sign up. Please try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0">
        <CardHeader className="gap-1 text-left">
          <CardTitle className="text-2xl font-semibold">
            Sign in to your account
          </CardTitle>
          <CardDescription>Use your Google account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(signInWithEmail)} noValidate>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={signInWithGoogle}
                >
                  <GoogleIcon />
                  Sign In with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="form-password">
                          Password
                        </FieldLabel>
                        <Link
                          href="#"
                          className="text-foreground ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        {...field}
                        id="form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="current-password"
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
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="hover:text-primary underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground px-6 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="/"
          className="hover:text-background underline underline-offset-4 transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/"
          className="hover:text-background underline underline-offset-4 transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
