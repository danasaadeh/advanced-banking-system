// features/users/components/UsersTable.tsx
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
import { Eye, CheckCircle, XCircle, User as UserIcon } from "lucide-react";
import type { User } from "../types/user.types";
import { UsersPagination } from "./UsersPagination";

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (user: User) => void;
  onActivate: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onActivate,
  onDeactivate,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-62.5">User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right w-64 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.national_id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role: string) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <div className="shrink-0 w-20">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(user)}
                        className="h-8 px-3 gap-1 hover:bg-transparent w-full justify-start"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </div>

                    {user.status !== "active" && (
                      <div className="shrink-0 w-24">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onActivate(user)}
                          className="h-8 px-3 gap-1 text-green-600 hover:bg-transparent hover:text-green-700 w-full justify-start"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Activate</span>
                        </Button>
                      </div>
                    )}

                    {user.status === "active" && (
                      <div className="shrink-0 w-24">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeactivate(user)}
                          className="h-8 px-3 gap-1 text-amber-600 hover:bg-transparent hover:text-amber-700 w-full justify-start"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Deactivate</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
