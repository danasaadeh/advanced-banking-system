// approve-transaction.command.ts
import type { Transaction } from "../types";
import type { UserRole } from "../approvals/approval.types";
import { transactionApprovalChain } from "../approvals/approval-chain";
import type { Command } from "./command";

interface ApproveCommandDeps {
  updateTransactionStatus: (payload: {
    transactionId: number;
    status: "approved";
  }) => Promise<unknown>;
}

export class ApproveTransactionCommand implements Command {
  private transaction: Transaction;
  private userRole: UserRole;
  private deps: ApproveCommandDeps;
  // dependency:
  //   In your Command pattern implementation, deps is an object that contains everything the command needs to do its job, except the data itself.

  // Think of deps as the tools the command uses, not the command’s data.

  constructor(
    transaction: Transaction,
    userRole: UserRole,
    deps: ApproveCommandDeps
  ) {
    this.transaction = transaction;
    this.userRole = userRole;
    this.deps = deps;
  }

  async execute() {
    const result = transactionApprovalChain.handle({
      transaction: this.transaction,
      userRole: this.userRole,
    });

    if (!result.canApprove) {
      throw new Error(`Approval denied. Required role: ${result.requiredRole}`);
    }

    await this.deps.updateTransactionStatus({
      transactionId: this.transaction.id,
      status: "approved",
    });
  }
}
