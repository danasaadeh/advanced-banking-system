// features/customer-service/components/StatusBadgeMenu.tsx
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useUpdateTicketStatus } from "../services/customer-service.mutations";
import { toast } from "@/shared/components/ui/sonner";
import type { Ticket } from "../types/customer-service.types";

interface StatusBadgeMenuProps {
  ticket: Ticket;
  onStatusChange?: () => void;
}

export const StatusBadgeMenu: React.FC<StatusBadgeMenuProps> = ({
  ticket,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const updateStatusMutation = useUpdateTicketStatus();

  const isLoading = updateStatusMutation.isLoading;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/20",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          label: "Pending",
        };
      case "in-progress":
        return {
          color: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20",
          icon: <RefreshCw className="h-3.5 w-3.5" />,
          label: "In Progress",
        };
      case "resolved":
        return {
          color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          label: "Resolved",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-700 border-gray-200 hover:bg-gray-500/20",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(ticket.status);

  const handleStatusChange = async (newStatus: "pending" | "resolved" | "in-progress") => {
    if (newStatus === ticket.status) return;

    try {
      await updateStatusMutation.mutateAsync({
        ticketId: ticket.id,
        status: newStatus,
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
      
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusOptions = () => {
    const allStatuses = [
      { value: "pending", label: "Pending", icon: AlertCircle },
      { value: "in-progress", label: "In Progress", icon: RefreshCw },
      { value: "resolved", label: "Resolved", icon: CheckCircle },
    ];

    return allStatuses.filter(option => option.value !== ticket.status);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Badge
          className={`
            ${statusConfig.color}
            font-medium px-3 py-1.5 border
            transition-all duration-200
            hover:shadow-sm hover:scale-[1.02]
            active:scale-[0.98]
            cursor-pointer
            group
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
          `}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
                <ChevronDown className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </div>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 p-2 animate-in slide-in-from-top-2 duration-200"
      >
        {getStatusOptions().map((option) => {
          const Icon = option.icon;
          const optionConfig = getStatusConfig(option.value);
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value as "pending" | "resolved" | "in-progress")}
              className={`
                cursor-pointer py-2.5 px-3 rounded-md
                flex items-center gap-3
                transition-all duration-150
                hover:bg-accent hover:scale-[1.02]
                active:scale-[0.98]
                ${optionConfig.color.replace("border", "")}
              `}
            >
              <div className={`p-1.5 rounded-md ${optionConfig.color.split(' ')[0]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};