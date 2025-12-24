import type { Command } from "./command";
import type { ScheduledTransaction } from "@/features/scheduled-trans/types";

interface CancelScheduledDeps {
  deleteScheduledTransaction: (id: number) => Promise<{ message: string }>; // Modify to return the actual object
}

export class CancelScheduledTransactionCommand implements Command {
  private transaction: ScheduledTransaction;
  private deps: CancelScheduledDeps;

  constructor(transaction: ScheduledTransaction, deps: CancelScheduledDeps) {
    this.transaction = transaction;
    this.deps = deps;
  }

  async execute() {
    const result = await this.deps.deleteScheduledTransaction(
      this.transaction.id
    );
    // You can handle the result here, e.g., logging the message if necessary
    console.log(result.message);
  }
}
