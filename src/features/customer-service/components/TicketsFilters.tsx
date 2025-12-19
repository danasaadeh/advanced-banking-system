// features/customer-service/components/TicketsFilters.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Filter } from "lucide-react";
import { STATUS_OPTIONS } from "../types/customer-service.types";

interface TicketsFiltersProps {
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  ...STATUS_OPTIONS,
];

export const TicketsFilters: React.FC<TicketsFiltersProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="w-full sm:w-48">
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger>
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTER_OPTIONS.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};