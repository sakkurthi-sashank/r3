import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/services/db";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { env } from "@/env";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const resend = new Resend(env.RESEND_API_KEY as string);
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL as string,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const resend = new Resend(env.RESEND_API_KEY as string);
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL as string,
        to: user.email,
        subject: "Verify your email",
        html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account",
    },
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});
