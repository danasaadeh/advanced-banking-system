import { AdminStrategy } from "./admin.strategy";
import { CustomerStrategy } from "./customer.strategy";
import  type { RoleStrategy } from "./role-strategy";

export const createRoleStrategy = (roles: string[]): RoleStrategy => {
  if (roles.includes("Admin")) {
    return new AdminStrategy();
  }

  return new CustomerStrategy();
};
