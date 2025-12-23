

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building,
  Users,
  ArrowLeftRight,
  Headset,
  ClockFading,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: string[];
}

export const dashboardMenu = (t: any): MenuItem[] => [
  {
    title: t("overview"),
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "Customer"],
  },
  {
    title: t("transactions"),
    url: "/dashboard/transactions",
    icon: ArrowLeftRight,
    roles: ["Admin", "Customer"],
  },
  {
    title: t("scheduled"),
    url: "/dashboard/scheduled-transactions",
    icon: ClockFading,
    roles: ["Admin", "Customer"],
  },
  {
    title: t("users"),
    url: "/dashboard/users",
    icon: Users,
    roles: ["Admin"],
  },
  {
    title: t("accounts"),
    url: "/dashboard/accounts",
    icon: Building,
    roles: ["Admin", "Customer"],
  },
  {
    title: t("customerService"),
    url: "/dashboard/customer-service",
    icon: Headset,
    roles: ["Admin"],
  },
];



export const dashboardSecondaryMenu = (t: any): MenuItem[] => [
  // !isEmployee()
  //   ? {
  //       title: t("users"),
  //       url: "/dashboard/users",
  //       icon: Users,
  //     }
  //   : null,
  // {
  //   title: t("customerService"),
  //   url: "/dashboard/government-units",
  //   icon: Building,
  // },
  // {
  //   title: t("statistics"),
  //   url: "/dashboard/statistics",
  //   icon: BarChart3,
  // },
  // {
  //   title: t("reports"),
  //   url: "/dashboard/government-units",
  //   icon: Building,
  // },
];
// .filter((item): item is MenuItem => item !== null);
