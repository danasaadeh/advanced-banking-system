import { useQueryClient } from "@tanstack/react-query";
import queryFacade from "@/lib/query-facade";
import { updateTransactionStatus } from "./api";

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient(); // ✅ SAME CLIENT AS PROVIDER

  return queryFacade.useApiMutation({
    mutationFn: updateTransactionStatus,
    successMessage: "Transaction status updated successfully",

    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transactions",
        });
      },
    },
  });
}
