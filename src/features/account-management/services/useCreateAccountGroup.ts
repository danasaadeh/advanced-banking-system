/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./api";
import { toast } from "@/shared/components/ui/sonner";
import type { CreateAccountGroupPayload } from "../types/accounts.data";

export const useCreateAccountGroup = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CreateAccountGroupPayload) => {
      // Validate payload
      if (
        !payload.account_type_id ||
        !payload.currency ||
        !payload.owner_user_id ||
        !Array.isArray(payload.user_ids) ||
        payload.user_ids.length === 0
      ) {
        throw new Error("Invalid payload: Missing required fields");
      }

      console.log("%c[useCreateAccountGroup] Sending payload:", "color: blue;", payload);

      const data = await accountsApiService.createAccountGroup(payload);
      console.log("%c[useCreateAccountGroup] Received response:", "color: green;", data);
      return data;
    },
    {
      onSuccess: (data) => {
        console.log("%c[useCreateAccountGroup] Account group created successfully!", "color: green; font-weight: bold;", data);

        // Invalidate the accounts list to refetch
        queryClient.invalidateQueries(["accounts"]);
        // Optionally also invalidate groups query if used elsewhere
        queryClient.invalidateQueries(["account-groups"]);

        toast.success((data as any)?.message ?? "Account group created successfully!");
      },
      onError: (err: any) => {
        console.error("%c[useCreateAccountGroup] Mutation failed:", "color: red; font-weight: bold;", err?.response?.data || err.message);
        toast.error(
          err?.response?.data?.message || err.message || "Failed to create account group"
        );
      },
    }
  );
};
