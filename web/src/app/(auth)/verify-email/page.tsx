import { VerifyEmailForm } from "../components/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="bg-accent relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6 text-white">
        <VerifyEmailForm email={params.email} />
      </div>
    </div>
  );
}
