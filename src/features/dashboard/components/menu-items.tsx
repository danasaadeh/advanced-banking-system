/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  FileText,
  Building,
  PhoneCall,
  Users,
  ArrowLeftRight,
  Headset,
  ClockFading,
} from "lucide-react";

export const dashboardMenu = (t: any) => [
  {
    title: t("overview"),
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: t("transactions"),
    url: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: t("scheduled"),
    url: "/dashboard/scheduled-transactions",
    icon: ClockFading,
  },

  {
    title: t("users"),
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: t("accounts"),
    url: "/dashboard/accounts",
    icon: Building,
  },

  {
    title: t("customer Service"),
    url: "/dashboard/customer-service",
    icon: Headset,
  },
];

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

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
