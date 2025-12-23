import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { NavLink } from "@/shared/components/nav-link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";

import { dashboardMenu, dashboardSecondaryMenu } from "./menu-items";

import { getUserRoles } from "@/features/dashboard/services/auth";
import { createRoleStrategy } from "../strategy/strategy-factory";


const DashboardSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    setRoles(getUserRoles());
  }, []);

  const roleStrategy = createRoleStrategy(roles);

  const menuItems = dashboardMenu(t).filter((item) =>
    roleStrategy.canAccess(item)
  );

  const secondaryItems = dashboardSecondaryMenu(t).filter((item) =>
    roleStrategy.canAccess(item)
  );

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        {!collapsed ? (
          <div className="space-y-1 px-2 py-2">
            <h2 className="text-xl font-bold">{t("bank")}</h2>
            <p className="text-xs opacity-70">{t("bankingSystem")}</p>
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <FileText className="h-5 w-5" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel>{t("dashboard")}</SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} end={item.url === "/dashboard"}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {secondaryItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
