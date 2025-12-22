// features/transactions/commands/command.ts
export interface Command {
  execute(): Promise<void>;
}
