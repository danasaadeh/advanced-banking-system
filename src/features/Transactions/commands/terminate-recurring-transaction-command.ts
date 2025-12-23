import type { Command } from "./command";
import type { RecurringTransaction } from "@/features/scheduled-trans/types";

interface TerminateRecurringDeps {
  terminateRecurring: (id: number) => Promise<unknown>;
}

export class TerminateRecurringTransactionCommand implements Command {
  private recurrence: RecurringTransaction;
  private deps: TerminateRecurringDeps;

  constructor(recurrence: RecurringTransaction, deps: TerminateRecurringDeps) {
    this.recurrence = recurrence;
    this.deps = deps;
  }

  async execute() {
    await this.deps.terminateRecurring(this.recurrence.id);
  }
}
