import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { state, isMobile } = useSidebar();

  return (
    <header className="bg-sidebar flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger
          className={`-ml-1 transition-all duration-300 ease-in-out ${
            state === "collapsed" || isMobile
              ? "scale-100 opacity-100"
              : "pointer-events-none w-0 scale-95 opacity-0"
          }`}
        />
      </div>
    </header>
  );
}
