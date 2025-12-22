// reject-transaction.command.ts
import type { Transaction } from "../types";
import type { Command } from "./command";

interface RejectCommandDeps {
  updateTransactionStatus: (payload: {
    transactionId: number;
    status: "rejected";
  }) => Promise<unknown>;
}

export class RejectTransactionCommand implements Command {
  private transaction: Transaction;
  private deps: RejectCommandDeps;

  constructor(transaction: Transaction, deps: RejectCommandDeps) {
    this.transaction = transaction;
    this.deps = deps;
  }

  async execute() {
    await this.deps.updateTransactionStatus({
      transactionId: this.transaction.id,
      status: "rejected",
    });
  }
}
