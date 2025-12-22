export class RetryScheduledTransactionCommand {
  constructor(private scheduleId: number) {}

  async execute() {
    console.log("Retry scheduled transaction:", this.scheduleId);
    // await api.retrySchedule(this.scheduleId);
  }
}
