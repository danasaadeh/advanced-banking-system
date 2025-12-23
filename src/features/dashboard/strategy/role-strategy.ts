import type { MenuItem } from "../components/menu-items";


export interface RoleStrategy {
  canAccess(menuItem: MenuItem): boolean;
}
