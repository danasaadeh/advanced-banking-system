import type {
  ApprovalContext,
  ApprovalResult,
  UserRole,
} from "../approval.types";
import { TransactionApprovalHandler } from "./transaction-approval-handler";

const LARGE_LIMIT = 50_000;

export class LargeTransactionHandler extends TransactionApprovalHandler {
  protected canHandle({ transaction }: ApprovalContext): boolean {
    return transaction.amount > 10_000 && transaction.amount <= LARGE_LIMIT;
  }

  protected process(context: ApprovalContext): ApprovalResult {
    const { userRole } = context;

    return {
      canApprove: userRole === "Admin",
      requiredRole: "Admin" as UserRole,
    };
  }
}
