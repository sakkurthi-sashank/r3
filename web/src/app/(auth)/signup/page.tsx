import { SignUpForm } from "../components/signup-form";

export default function SignUpPage() {
  return (
    <div
      style={{
        backgroundImage: "url(/image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6 text-white">
        <SignUpForm />
      </div>
    </div>
  );
}
