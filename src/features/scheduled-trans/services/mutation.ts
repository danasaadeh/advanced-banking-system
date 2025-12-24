import { useQueryClient } from "@tanstack/react-query";
import queryFacade, { useApiQuery } from "@/lib/query-facade";
import {
  deleteScheduledTransaction,
  getScheduledTransactionDetails,
  terminateRecurringTransaction,
  toggleRecurringTransaction,
  updateRecurringTransaction,
  updateScheduledTransaction,
} from "./api";
import type {
  RecurringTransaction,
  RecurringTransactionDTO,
  ScheduledTransactionDTO,
} from "../types";

/**
 * Use Mutation Hook for Updating Scheduled Transaction
 */
export function useUpdateScheduledTransaction() {
  const queryClient = useQueryClient(); // For cache invalidation

  return queryFacade.useApiMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { amount?: number; scheduled_at?: string };
    }) => updateScheduledTransaction(id, payload), // Correct mutation signature

    successMessage: "Scheduled transaction updated successfully", // Success message
    errorMessage: "Failed to update scheduled transaction", // Error message

    // Handle cache invalidation or updates after the mutation succeeds
    extraOptions: {
      onSuccess: (data) => {
        // Invalidate the "scheduled-transactions" queries after mutation
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "scheduled-transactions",
        });
      },
    },
  });
}

export function useDeleteScheduledTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: (id: number) => deleteScheduledTransaction(id),

    successMessage: "Scheduled transaction deleted successfully",
    errorMessage: "Failed to delete scheduled transaction",

    extraOptions: {
      onSuccess: () => {
        // Invalidate the "scheduled-transactions" queries after deletion
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "scheduled-transactions",
        });
      },
    },
  });
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        amount?: number;
        frequency?: "daily" | "weekly" | "monthly";
        end_date?: string;
      };
    }): Promise<RecurringTransaction> => {
      const dto: RecurringTransactionDTO = await updateRecurringTransaction(
        id,
        payload
      );

      // Map DTO to your frontend type
      const mapped: RecurringTransaction = {
        id: dto.id,
        reference_number: dto.reference_number,
        source_account: dto.account?.account_number,
        target_account: dto.target_account?.account_number,
        type: dto.type,
        amount: Number(dto.amount),
        currency: dto.account?.currency || "USD",
        frequency: dto.frequency,
        start_date: dto.start_date,
        end_date: dto.end_date,
        is_active: dto.active,
      };

      return mapped;
    },

    successMessage: "Recurring transaction updated successfully",
    errorMessage: "Failed to update recurring transaction",

    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "recurring-transactions",
        });
      },
    },
  });
}

export function useTerminateRecurringTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: async (id: number): Promise<RecurringTransaction> => {
      const res = await terminateRecurringTransaction(id);

      // Map response to frontend RecurringTransaction type
      return {
        id: res.id,
        reference_number: "", // You may not have it in the terminate response
        source_account: undefined,
        target_account: undefined,
        type: "transfer", // default placeholder, adjust if needed
        amount: 0, // placeholder
        currency: "USD", // placeholder
        frequency: "daily", // placeholder
        start_date: "", // placeholder
        end_date: res.endDate,
        is_active: false,
      };
    },
    successMessage: "Recurring transaction terminated successfully",
    errorMessage: "Failed to terminate recurring transaction",
    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "recurring-transactions",
        });
      },
    },
  });
}

export function useToggleRecurringTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: number;
      isActive: boolean;
    }): Promise<RecurringTransaction> => {
      const res = await toggleRecurringTransaction(id, isActive);

      // Map response to frontend RecurringTransaction type
      return {
        id: res.id,
        reference_number: "", // Not returned in response
        source_account: undefined,
        target_account: undefined,
        type: "transfer", // placeholder
        amount: 0, // placeholder
        currency: "USD", // placeholder
        frequency: "daily", // placeholder
        start_date: "", // placeholder
        end_date: "", // placeholder
        is_active: res.is_active,
      };
    },
    successMessage: "Recurring transaction status updated successfully",
    errorMessage: "Failed to update recurring transaction status",
    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "recurring-transactions",
        });
      },
    },
  });
}

export function useScheduledTransactionDetails(id: number | null) {
  return useApiQuery<ScheduledTransactionDTO>({
    key: ["scheduled-transaction-details", id],
    fetcher: () => getScheduledTransactionDetails(id as number),
    enabled: !!id,
    errorMessage: "Failed to load scheduled transaction",
  });
}
