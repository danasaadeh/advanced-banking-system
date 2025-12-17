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
import { Eye, CheckCircle, XCircle, Ban, User as UserIcon } from "lucide-react";
import type { User } from "../types/user.types";

interface UsersTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onActivate: (user: User) => void;
  onDeactivate: (user: User) => void;
  onSuspend: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onViewDetails,
  onActivate,
  onDeactivate,
  onSuspend,
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
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Suspended
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-62.5">User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  <div className="text-sm text-muted-foreground">{user.phone}</div>
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
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(user)}
                    className="h-8 w-8 p-0"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {user.status !== "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onActivate(user)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      title="Activate User"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  {user.status === "active" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeactivate(user)}
                        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                        title="Deactivate User"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSuspend(user)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Suspend User"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};