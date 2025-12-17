// features/users/services/user.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApiService } from "./user.api";
import { toast } from "@/shared/components/ui/sonner";

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { userId: number }
  >({
    mutationFn: ({ userId }) => userApiService.activateUser(userId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to activate user");
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { userId: number }
  >({
    mutationFn: ({ userId }) => userApiService.deactivateUser(userId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { userId: number }
  >({
    mutationFn: ({ userId }) => userApiService.suspendUser(userId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to suspend user");
    },
  });
};