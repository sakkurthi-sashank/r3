"use client";

import { IconEdit, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    href: string;
    icon?: Icon;
    active?: boolean;
  }[];
}) {
  const router = useRouter();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {/* <SidebarMenuItem className="flex items-center">
              <Button variant="default" size="sm" className="h-9 w-full">
                <IconEdit className="h-5 w-5" />
                <span>New Chat</span>
              </Button>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        {/* <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="flex w-full flex-row-reverse items-center justify-between"
                  tooltip={item.title}
                  isActive={item.active}
                  onClick={() => router.push(item.href)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent> */}
      </SidebarGroup>
    </>
  );
}
