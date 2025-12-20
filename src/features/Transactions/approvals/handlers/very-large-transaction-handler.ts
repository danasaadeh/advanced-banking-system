import type {
  ApprovalContext,
  ApprovalResult,
  UserRole,
} from "../approval.types";
import { TransactionApprovalHandler } from "./transaction-approval-handler";

//concrete classes for the base handler
export class VeryLargeTransactionHandler extends TransactionApprovalHandler {
  protected canHandle(_: ApprovalContext): boolean {
    return true; // fallback
  }

  protected process(_: ApprovalContext): ApprovalResult {
    return {
      canApprove: false,
      requiredRole: "Admin" as UserRole,
      reason: "Director approval required",
    };
  }
}
