// features/customer-service/services/customer-service.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerServiceApiService } from "./customer-service.api";
import { toast } from "@/shared/components/ui/sonner";
import type { TicketFormData } from "../types/customer-service.types";

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: any },
    Error,
    TicketFormData
  >({
    mutationFn: (ticketData) => customerServiceApiService.createTicket(ticketData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create ticket");
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { ticketId: number; status: "pending" | "resolved" | "in-progress" }
  >({
    mutationFn: ({ ticketId, status }) => 
      customerServiceApiService.updateTicketStatus(ticketId, status),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update ticket status");
    },
  });
};