import type { Command } from "./command";

export interface UndoableCommand extends Command {
  undo(): Promise<void>;
}
