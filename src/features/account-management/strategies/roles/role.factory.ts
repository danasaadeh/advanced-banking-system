// strategies/roles/role.factory.ts
import type{ Role } from "@/features/account-management/types/role";
import { CustomerStrategy } from "./customer.strategy";
import { AdminStrategy } from "./admin.strategy";

export const getRoleStrategy = (role: Role) => {
  switch (role) {
    case "customer":
      return CustomerStrategy;
    case "admin":
    case "manager":
      return AdminStrategy;
    default:
      return CustomerStrategy;
  }
};
