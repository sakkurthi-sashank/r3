"use client";

import * as React from "react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { IconFile, IconLayoutDashboard } from "@tabler/icons-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      href: "/",
      icon: IconLayoutDashboard,
      active: false,
    },
    {
      title: "File Uploads",
      href: "/uploads",
      icon: IconFile,
      active: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const dataWithActiveStates = React.useMemo(() => {
    return {
      ...data,
      navMain: data.navMain.map((item) => ({
        ...item,
        active: item.href === pathname,
      })),
    };
  }, [pathname]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-(--header-height) border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataWithActiveStates.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
