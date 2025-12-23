/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RoleStrategy } from "./role-strategy";
import type { MenuItem } from "../components/menu-items";

export class AdminStrategy implements RoleStrategy {
  canAccess(_: MenuItem): boolean {
    return true; // Admin 
  }
}
