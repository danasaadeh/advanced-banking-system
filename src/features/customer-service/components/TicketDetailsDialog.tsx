// features/customer-service/components/TicketDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area"; 
import { 
  User, 
  Mail, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText
} from "lucide-react";
import type { Ticket } from "../types/customer-service.types";

interface TicketDetailsDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TicketDetailsDialog: React.FC<TicketDetailsDialogProps> = ({
  ticket,
  open,
  onOpenChange,
}) => {
  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-amber-500/10 text-amber-700 border-amber-200",
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Pending",
        };
      case "in-progress":
        return {
          color: "bg-blue-500/10 text-blue-700 border-blue-200",
          icon: <RefreshCw className="h-4 w-4" />,
          label: "In Progress",
        };
      case "resolved":
        return {
          color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Resolved",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-700 border-gray-200",
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(ticket.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Ticket Details
            </DialogTitle>
            <Badge 
              className={`${statusConfig.color} font-medium px-3 py-1.5 border flex items-center gap-2`}
              variant="outline"
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
          <DialogDescription>
            Ticket #{ticket.id.toString().padStart(4, '0')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Title Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <Separator />
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{ticket.user_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{ticket.user_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.created_at)}
                    </p>
                  </div>
                </div>

                {ticket.updated_at && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(ticket.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket ID */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ticket ID</span>
                <span className="font-mono font-medium">
                  #{ticket.id.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};