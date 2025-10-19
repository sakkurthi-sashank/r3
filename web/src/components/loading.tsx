import { LoaderCircle } from "lucide-react";

export const Loading = ({ className }: { className?: string }) => {
  return (
    <LoaderCircle
      strokeWidth={1.5}
      className={`h-4 w-4 animate-spin ${className}`}
    />
  );
};
