// approvals/role-utils.ts
import type { UserRole } from "./approval.types";

const ROLE_PRIORITY: UserRole[] = ["Admin", "Manager", "Teller", "Customer"];

export function resolveUserRole(roles: UserRole[] | null): UserRole {
  if (!roles || roles.length === 0) return "Customer";

  return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? "Customer";
}
