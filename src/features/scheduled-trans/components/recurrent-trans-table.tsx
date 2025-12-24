import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Edit, StopCircle } from "lucide-react";

import type { RecurringTransaction } from "../types";

interface Props {
  recurrences: RecurringTransaction[];
  loading?: boolean; // Add a loading prop
  onToggleActive: (recurrence: RecurringTransaction, active: boolean) => void;
  onEdit: (recurrence: RecurringTransaction) => void;
  onViewHistory: (recurrence: RecurringTransaction) => void;
  onTerminate: (recurrence: RecurringTransaction) => void;
  isToggling?: boolean; // ✅ Add this
}

export const RecurringTransactionsTable: React.FC<Props> = ({
  recurrences,
  loading = false, // Default to false if no loading prop is passed
  onToggleActive,
  onEdit,
  onViewHistory,
  onTerminate,
  isToggling,
}) => {
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const getFrequencyBadge = (frequency: RecurringTransaction["frequency"]) => {
    const styles: Record<string, string> = {
      daily: "bg-blue-100 text-blue-800",
      weekly: "bg-purple-100 text-purple-800",
      monthly: "bg-amber-100 text-amber-800",
    };

    return (
      <Badge className={styles[frequency]}>
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      {/* Loading State */}
      {loading && (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                  <p className="text-muted-foreground text-sm">
                    Loading recurring transactions...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      {/* Data Rendering */}
      {!loading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recurrences.map((recurrence) => (
              <TableRow key={recurrence.id}>
                <TableCell className="font-medium">
                  {recurrence.reference_number}
                </TableCell>

                <TableCell>{recurrence.source_account ?? "—"}</TableCell>

                <TableCell>{recurrence.target_account ?? "—"}</TableCell>

                <TableCell className="capitalize">{recurrence.type}</TableCell>

                <TableCell>
                  {recurrence.amount.toLocaleString()} {recurrence.currency}
                </TableCell>

                <TableCell>{getFrequencyBadge(recurrence.frequency)}</TableCell>

                <TableCell>{formatDate(recurrence.start_date)}</TableCell>

                <TableCell>{formatDate(recurrence.end_date)}</TableCell>

                {/* Active Toggle */}
                <TableCell>
                  <Switch
                    checked={recurrence.is_active}
                    onCheckedChange={(v) => onToggleActive(recurrence, v)}
                    disabled={isToggling}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* View Execution History */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View Execution History"
                      onClick={() => onViewHistory(recurrence)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Edit Recurrence"
                      onClick={() => onEdit(recurrence)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Terminate */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="Terminate"
                      onClick={() => onTerminate(recurrence)}
                    >
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {recurrences.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-8 text-center text-muted-foreground"
                >
                  No recurring transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
