import type { ApprovalContext, ApprovalResult } from "../approval.types";

export abstract class TransactionApprovalHandler {
  protected next?: TransactionApprovalHandler;

  setNext(handler: TransactionApprovalHandler) {
    this.next = handler;
    return handler;
  }

  handle(context: ApprovalContext): ApprovalResult {
    if (this.canHandle(context)) {
      return this.process(context);
    }

    if (this.next) {
      return this.next.handle(context);
    }

    return { canApprove: false };
  }

  protected abstract canHandle(context: ApprovalContext): boolean;
  protected abstract process(context: ApprovalContext): ApprovalResult;
}
