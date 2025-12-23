import type { MenuItem } from "../components/menu-items";
import  type{ RoleStrategy } from "./role-strategy";

export class CustomerStrategy implements RoleStrategy {
  canAccess(menuItem: MenuItem): boolean {
    return !menuItem.roles || menuItem.roles.includes("Customer");
  }
}
