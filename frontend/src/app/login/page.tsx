import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
          <Skeleton className="h-[420px] w-full max-w-md" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
