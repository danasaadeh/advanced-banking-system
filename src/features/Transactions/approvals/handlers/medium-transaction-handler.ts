import type {
  ApprovalContext,
  ApprovalResult,
  UserRole,
} from "../approval.types";
import { TransactionApprovalHandler } from "./transaction-approval-handler";

const MEDIUM_LIMIT = 10_000;

export class MediumTransactionHandler extends TransactionApprovalHandler {
  protected canHandle({ transaction }: ApprovalContext): boolean {
    return transaction.amount > 1_000 && transaction.amount <= MEDIUM_LIMIT;
  }

  protected process(context: ApprovalContext): ApprovalResult {
    const { userRole } = context;

    return {
      canApprove: userRole === "Manager" || userRole === "Admin",
      requiredRole: "Manager" as UserRole,
    };
  }
}
