import type { Transaction } from "../types";

export type UserRole = "Customer" | "Teller" | "Manager" | "Admin";

export interface ApprovalContext {
  transaction: Transaction;
  userRole: UserRole;
}

export interface ApprovalResult {
  canApprove: boolean;
  requiredRole?: UserRole;
  reason?: string;
}
