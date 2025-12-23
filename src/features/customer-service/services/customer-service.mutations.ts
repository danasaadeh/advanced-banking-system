// features/customer-service/services/customer-service.mutations.ts
import { useApiMutation, queryClient } from "@/lib/query-facade";
import { customerServiceApiService } from "./customer-service.api";


export const useCreateTicket = () => useApiMutation({
  mutationFn: customerServiceApiService.createTicket,
  successMessage: "Ticket created successfully",
  extraOptions: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  },
});

export const useUpdateTicketStatus = () => useApiMutation({
  mutationFn: ({ ticketId, status }: { 
    ticketId: number; 
    status: "pending" | "in_progress" | "resolved" 
  }) => customerServiceApiService.updateTicketStatus(ticketId, status),
  successMessage: "Ticket status updated successfully",
  extraOptions: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  },
});