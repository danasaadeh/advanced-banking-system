import type { ScheduledTransaction, ScheduledTransactionDTO } from "../types";

export function mapScheduledTransaction(
  dto: ScheduledTransactionDTO
): ScheduledTransaction {
  return {
    id: dto.id,
    reference_number: dto.reference_number,
    type: dto.type,
    amount: Number(dto.amount),
    currency: dto.target_account?.currency ?? "USD",
    scheduled_at: dto.scheduled_at,
    status: dto.status,

    source_account: dto.account?.account_number,
    target_account: dto.target_account?.account_number,

    created_by: `${dto.creator.first_name} ${dto.creator.last_name}`,
  };
}
