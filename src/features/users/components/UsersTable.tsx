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
import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { User } from "../types/user.types";

interface UsersTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onActivate: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
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
              {/* User Column */}
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {user.national_id}
                  </div>
                </div>
              </TableCell>

              {/* Contact Column */}
              <TableCell>
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.phone}
                  </div>
                </div>
              </TableCell>

              {/* Roles Column */}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role: string) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              {/* Status Column */}
              <TableCell>{getStatusBadge(user.status)}</TableCell>

              {/* Joined Column */}
              <TableCell>{formatDate(user.created_at)}</TableCell>

              {/* Actions Column */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* View Details */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="View Details"
                    onClick={() => onViewDetails(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Activate / Deactivate */}
                  {user.status !== "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      title="Activate"
                      onClick={() => onActivate(user)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  {user.status === "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                      title="Deactivate"
                      onClick={() => onDeactivate(user)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};