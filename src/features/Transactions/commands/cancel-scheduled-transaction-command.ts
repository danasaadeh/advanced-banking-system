export class CancelScheduledTransactionCommand {
  constructor(private scheduleId: number) {}

  async execute() {
    console.log("Cancel schedule:", this.scheduleId);
    // await api.cancelSchedule(this.scheduleId);
  }
}
