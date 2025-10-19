"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { authClient } from "@/lib/auth-client";
import { Loading } from "@/components/loading";
import { useRouter } from "next/navigation";
import { SiteHeader } from "./components/site-header";

export default function MainLayout() {
  const { data: session, isPending, error } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading className="h-8 w-8" />
      </div>
    );
  }

  if (!session?.user) {
    router.push("/signin");
    return null;
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
