import type { Command } from "./command";
import type { CreateScheduledTransactionPayload } from "@/features/transactions/types";
import type { ScheduledTransaction } from "@/features/scheduled-trans/types";

interface RetryScheduledDeps {
  fetchScheduledDetails: (id: number) => Promise<any>;
  createScheduledTransaction: (
    payload: CreateScheduledTransactionPayload
  ) => Promise<unknown>;
}

export class RetryScheduledTransactionCommand implements Command {
  private transaction: ScheduledTransaction;
  private deps: RetryScheduledDeps;

  constructor(transaction: ScheduledTransaction, deps: RetryScheduledDeps) {
    this.transaction = transaction;
    this.deps = deps;
  }

  private mapToCreatePayload(dto: any): CreateScheduledTransactionPayload {
    return {
      type: dto.type,
      amount: Number(dto.amount),
      scheduled_at: dto.scheduled_at,
      account_id: dto.account_id,
      ...(dto.type === "transfer"
        ? { target_account_id: dto.target_account_id }
        : {}),
    };
  }

  async execute() {
    const details = await this.deps.fetchScheduledDetails(this.transaction.id);
    const payload = this.mapToCreatePayload(details);
    await this.deps.createScheduledTransaction(payload);
  }
}
