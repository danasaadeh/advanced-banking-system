/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type JSX } from "react";
import DashboardLayout from "../components/dashboard-layout";
import ProtectedRoute from "@/shared/components/protected-route";

import { StatisticsPage } from "@/features/statistics/pages";
import RoleProtectedRoute from "@/shared/components/role-protected-route";

const DashboardPage = lazy(() => import("../pages/dashboard"));

const Transactions = lazy(() => import("../../Transactions/pages"));

const Settings = lazy(() => import("../pages/settings"));
const Accounts = lazy(() => import("../../account-management/pages"));
const CustomerService = lazy(() => import("../pages/customer-service"));

const Load = (c: JSX.Element) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-screen ">
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-950 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg">loading...</p>
        </div>
      </div>
    }
  >
    {c}
  </Suspense>
);

export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: Load(<StatisticsPage />) },
      { path: "transactions", element: Load(<Transactions />) },
      { path: "accounts", element: Load(<Accounts />) },


      { path: "customer-service", element: Load(<CustomerService />) },
    ],
  },
];
