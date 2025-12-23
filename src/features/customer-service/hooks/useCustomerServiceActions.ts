// features/customer-service/hooks/useCustomerServiceActions.ts
import { useState } from "react";
import { useCreateTicket, useUpdateTicketStatus } from "../services/customer-service.mutations";
import { queryClient } from "@/lib/query-facade";
import type { Ticket, TicketFormData } from "../types/customer-service.types";

export const useCustomerServiceActions = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [actionType, setActionType] = useState<"create" | "change-status" | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const createTicket = useCreateTicket();
  const updateTicketStatus = useUpdateTicketStatus();

  const handleCreateTicket = () => {
    setSelectedTicket(null);
    setActionType("create");
    setShowDialog(true);
  };

  const handleChangeStatus = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActionType("change-status");
    setShowDialog(true);
  };

  const handleSaveTicket = async (ticketData: TicketFormData): Promise<{ success: boolean; message: string }> => {
    try {
      await createTicket.mutateAsync(ticketData);
      
      // إعادة جلب البيانات تلقائياً
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      }, 300);
      
      return { success: true, message: "Ticket created successfully" };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Operation failed" 
      };
    } finally {
      setShowDialog(false);
      setSelectedTicket(null);
      setActionType(null);
    }
  };

  const handleUpdateStatus = async (status: "pending" | "in_progress" | "resolved"): Promise<{ success: boolean; message: string }> => {
    if (!selectedTicket) return { success: false, message: "No ticket selected" };

    try {
      await updateTicketStatus.mutateAsync({ 
        ticketId: selectedTicket.id, 
        status 
      });
      
      // إعادة جلب البيانات تلقائياً
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      }, 300);
      
      return { success: true, message: "Status updated successfully" };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Operation failed" 
      };
    } finally {
      setShowDialog(false);
      setSelectedTicket(null);
      setActionType(null);
    }
  };

  return {
    selectedTicket,
    actionType,
    showDialog,
    setShowDialog,
    handleCreateTicket,
    handleChangeStatus,
    handleSaveTicket,
    handleUpdateStatus,
    isLoading: createTicket.isLoading || updateTicketStatus.isLoading,
  };
};