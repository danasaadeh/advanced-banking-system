// features/customer-service/pages/CustomerServicePage.tsx
import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useApiQuery } from "@/lib/query-facade";
import { customerServiceApiService } from "../services/customer-service.api";
import { useCustomerServiceFilters } from "../hooks/useCustomerServiceFilters";
import { useCustomerServiceActions } from "../hooks/useCustomerServiceActions";
import { TicketsFilters } from "../components/TicketsFilters";
import { TicketCard } from "../components/TicketCard";
import { TicketFormDialog } from "../components/TicketFormDialog";
import { TicketDetailsDialog } from "../components/TicketDetailsDialog";
import type { Ticket } from "../types/customer-service.types";
import { TicketContext } from "../Strategy/strategy-context";
import { AdminTicketStrategy } from "../Strategy/admin-strategy";
import { CustomerTicketStrategy } from "../Strategy/customer.strategy";

const CustomerServicePage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
  } = useCustomerServiceFilters();

  const {
    actionType,
    showDialog,
    setShowDialog,
    handleCreateTicket,
    handleSaveTicket,
    isLoading,
  } = useCustomerServiceActions();

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsTicket, setDetailsTicket] = useState<Ticket | null>(null);

  const {
    data,
    isLoading: isLoadingTickets,
    isError,
    refetch,
  } = useApiQuery({
    key: ["tickets", searchQuery, selectedStatus, currentPage, 8],
    fetcher: () =>
      customerServiceApiService.getTickets(
        searchQuery,
        selectedStatus,
        currentPage,
        8
      ),
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (data?.data) {
      setTickets(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!showDialog && !showDetailsDialog) {
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showDialog, showDetailsDialog, refetch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setDetailsTicket(ticket);
    setShowDetailsDialog(true);
  };

  const handleStatusChangeFromCard = (updatedTicket: Ticket) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    setTickets(updatedTickets);
  };

  // قراءة الدور من localStorage
  let rolesRaw = localStorage.getItem("roles");
  let userRole = "customer"; 
  if (rolesRaw) {
    try {
      const rolesArray: string[] = JSON.parse(rolesRaw);
      if (rolesArray.includes("Admin")) {
        userRole = "admin";
      }
    } catch (error) {
      console.error("Failed to parse roles from localStorage", error);
    }
  }

  const userId = Number(localStorage.getItem("user_id"));

  // اختيار الستراتيجية حسب الدور
  const ticketStrategy =
    userRole === "admin"
      ? new AdminTicketStrategy()
      : new CustomerTicketStrategy();

  const ticketContext = new TicketContext(ticketStrategy);

  // تصفية التيكتات قبل العرض
  const ticketsToShow = ticketContext.filterTickets(tickets, userId);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Customer Service</h1>
        </div>
        <Button
          onClick={handleCreateTicket}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by title, description, or customer..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <TicketsFilters
          selectedStatus={selectedStatus}
          onStatusChange={(value) => {
            setSelectedStatus(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Tickets Grid */}
      {isLoadingTickets ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading tickets...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load tickets. Please try again.
        </div>
      ) : ticketsToShow.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tickets found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ticketsToShow.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={() => handleStatusChangeFromCard(ticket)}
              onClick={handleTicketClick}
              canEditStatus={ticketContext.canEditStatus(ticket, userRole)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <TicketFormDialog
        open={actionType === "create" && showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveTicket}
        isLoading={isLoading}
      />
      <TicketDetailsDialog
        ticket={detailsTicket}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
};

export default CustomerServicePage;
