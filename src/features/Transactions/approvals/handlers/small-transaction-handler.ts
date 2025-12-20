import { TransactionApprovalHandler } from "./transaction-approval-handler";
import type { ApprovalContext } from "../approval.types";

const SMALL_LIMIT = 1_000;

export class SmallTransactionHandler extends TransactionApprovalHandler {
  protected canHandle({ transaction }: ApprovalContext): boolean {
    return transaction.amount <= SMALL_LIMIT;
  }

  protected process(): { canApprove: boolean } {
    return {
      canApprove: true,
    };
  }
}
