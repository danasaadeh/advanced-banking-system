import type { Command } from "./command";

import type { RecurringTransaction } from "@/features/scheduled-trans/types";
interface ToggleRecurringDeps {
  toggleRecurring: (payload: {
    id: number;
    isActive: boolean;
  }) => Promise<unknown>;
}

export class ToggleRecurringTransactionCommand implements Command {
  private recurrence: RecurringTransaction;
  private active: boolean;
  private deps: ToggleRecurringDeps;

  constructor(
    recurrence: RecurringTransaction,
    active: boolean,
    deps: ToggleRecurringDeps
  ) {
    this.recurrence = recurrence;
    this.active = active;
    this.deps = deps;
  }

  async execute() {
    await this.deps.toggleRecurring({
      id: this.recurrence.id,
      isActive: this.active,
    });
  }
}
