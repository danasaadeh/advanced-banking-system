import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import type { ScheduledTransaction } from "../types";

interface Props {
  schedules: ScheduledTransaction[];
  loading?: boolean; // NEW: Handle loading state
  onViewDetails: (schedule: ScheduledTransaction) => void;
  onEdit: (schedule: ScheduledTransaction) => void;
  onCancel: (schedule: ScheduledTransaction) => void;
  onRetry: (schedule: ScheduledTransaction) => void;
}

export const ScheduledTransactionsTable: React.FC<Props> = ({
  schedules,
  loading = false, // Default to false if no loading prop is passed
  onViewDetails,
  onEdit,
  onCancel,
  onRetry,
}) => {
  // Function to render the status badge
  const getStatusBadge = (status: ScheduledTransaction["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        );
      case "executed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Executed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to format the scheduled date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Refrence Number</TableHead>
            <TableHead>Source Account</TableHead>
            <TableHead>Target Account</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading State */}
          {loading && (
            <TableRow>
              <TableCell colSpan={9} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                  <p className="text-muted-foreground text-sm">
                    Loading transactions...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* Data Rendering */}
          {!loading &&
            schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  {schedule.reference_number}
                </TableCell>

                <TableCell>{schedule.source_account ?? "—"}</TableCell>

                <TableCell>{schedule.target_account ?? "—"}</TableCell>

                <TableCell className="capitalize">{schedule.type}</TableCell>

                <TableCell>
                  {schedule.amount.toLocaleString()} {schedule.currency}
                </TableCell>

                <TableCell>{formatDate(schedule.scheduled_at)}</TableCell>

                <TableCell>{getStatusBadge(schedule.status)}</TableCell>

                <TableCell>{schedule.created_by}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* View Details */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View Details"
                      onClick={() => onViewDetails(schedule)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Edit (only for scheduled) */}
                    {schedule.status === "scheduled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit"
                        onClick={() => onEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Cancel/Delete (only for scheduled) */}
                    {schedule.status === "scheduled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Cancel"
                        onClick={() => onCancel(schedule)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Retry (only for failed) */}
                    {schedule.status === "failed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                        title="Retry"
                        onClick={() => onRetry(schedule)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {/* No Data */}
          {!loading && schedules.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-8 text-center text-muted-foreground"
              >
                No scheduled transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
