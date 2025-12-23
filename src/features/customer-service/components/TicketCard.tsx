import React from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";
import { StatusBadgeMenu } from "./StatusBadgeMenu";
import type { Ticket } from "../types/customer-service.types";

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange?: (updatedTicket: Ticket) => void;
  onClick?: (ticket: Ticket) => void;
  canEditStatus: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onStatusChange,
  onClick,
  canEditStatus,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleClick = () => onClick?.(ticket);

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 hover:shadow-primary/10 cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div onClick={(e) => e.stopPropagation()}>
              {canEditStatus ? (
                <StatusBadgeMenu
                  ticket={ticket}
                  onStatusChange={onStatusChange}
                />
              ) : (
                <div
                  className={`px-2 py-1 rounded-md text-xs ${ticket.status_color}`}
                >
                  {ticket.status_label}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              #{ticket.id.toString().padStart(4, "0")}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {ticket.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {ticket.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {ticket.user.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{ticket.user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 flex-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">
                Created {formatDate(ticket.created_at)}
              </span>
            </div>
            {ticket.updated_at && ticket.status !== "pending" && (
              <div className="text-xs px-2 py-1 bg-muted rounded-md">
                Updated
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
