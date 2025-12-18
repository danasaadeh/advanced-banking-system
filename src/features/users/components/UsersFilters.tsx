// features/users/components/UsersFilters.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Filter } from "lucide-react";

interface UsersFiltersProps {
  selectedRole: string;
  onRoleChange: (value: string) => void;
}

const ROLES = [
  { value: "all", label: "All Roles" },
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Teller", label: "Teller" },
  { value: "Customer", label: "Customer" },
];

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="w-full sm:w-50">
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger>
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};