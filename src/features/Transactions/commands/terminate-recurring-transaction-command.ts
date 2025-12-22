export class TerminateRecurringTransactionCommand {
  constructor(private recurrenceId: number) {}

  async execute() {
    console.log("Terminate recurrence:", this.recurrenceId);
    // await api.terminateRecurrence(this.recurrenceId);
  }
}
