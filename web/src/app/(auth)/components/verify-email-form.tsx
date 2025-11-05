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
import { Field, FieldDescription } from "@/components/ui/field";
import Link from "next/link";

export function VerifyEmailForm({
  className,
  email,
  ...props
}: React.ComponentProps<"div"> & { email?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0">
        <CardHeader className="gap-1 text-left">
          <CardTitle className="text-2xl font-semibold">
            Verify your email
          </CardTitle>
          <CardDescription>
            {email ? (
              <>
                We&apos;ve sent a verification link to{" "}
                <span className="text-foreground font-medium">{email}</span>.
                Please check your inbox and click the link to verify your
                account.
              </>
            ) : (
              <>
                We&apos;ve sent a verification link to your email address.
                Please check your inbox and click the link to verify your
                account.
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 text-sm">
              <p className="mb-2 font-medium">Next steps:</p>
              <ol className="text-muted-foreground list-inside list-decimal space-y-1">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Sign in to your account</li>
              </ol>
            </div>

            <Field>
              <Link href="/signin" className="w-full">
                <Button type="button" className="w-full">
                  Go to Sign In
                </Button>
              </Link>
              <FieldDescription className="text-center">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <Link
                  href="/signup"
                  className="hover:text-primary underline underline-offset-4"
                >
                  try signing up again
                </Link>
              </FieldDescription>
            </Field>
          </div>
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
