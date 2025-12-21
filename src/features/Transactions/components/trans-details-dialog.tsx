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
  ArrowLeftRight,
  FileText,
  DollarSign,
  Calendar,
  UserCheck,
  ShieldCheck,
  Clock,
  Hash,
} from "lucide-react";

import { useTransactionDetails } from "../services/query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: number | null;
}

/* ---------------- Helpers ---------------- */

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ---------------- Component ---------------- */

export const TransactionDetailsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  transactionId,
}) => {
  const { data, isLoading, error } = useTransactionDetails(transactionId);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        {/* ---------------- Header ---------------- */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
            </div>

            <div>
              <DialogTitle className="text-xl font-bold">
                Transaction Details
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Hash className="h-3.5 w-3.5" />
                {data?.referenceNumber ?? "—"}
                {data && (
                  <>
                    <span className="mx-2">•</span>
                    {getStatusBadge(data.basicInfo.status)}
                  </>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ---------------- Body ---------------- */}
        <ScrollArea className="h-[calc(85vh-160px)] px-6">
          {/* ---------- Loading ---------- */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-[300px] gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              <p className="text-muted-foreground text-sm">
                Loading transaction details...
              </p>
            </div>
          )}

          {/* ---------- Error ---------- */}
          {error && !isLoading && (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm text-red-600">
                Failed to load transaction details
              </p>
            </div>
          )}

          {/* ---------- Content ---------- */}
          {data && !isLoading && (
            <div className="space-y-5 py-4 text-sm">
              {/* ================= Basic Info ================= */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">
                    Transaction Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoCard
                    label="Description"
                    value={data.basicInfo.description}
                  />
                  <InfoCard
                    label="Type"
                    value={data.basicInfo.type}
                    capitalize
                  />
                  <InfoCard
                    label="Amount"
                    value={`${
                      data.basicInfo.direction === "credit" ? "+" : "-"
                    }${data.basicInfo.amount.toLocaleString()} ${
                      data.basicInfo.currency
                    }`}
                    icon={<DollarSign className="h-3.5 w-3.5" />}
                  />
                  <InfoCard
                    label="Date"
                    value={formatDate(data.basicInfo.date)}
                    icon={<Calendar className="h-3.5 w-3.5" />}
                  />
                </div>
              </section>

              <Separator />

              {/* ================= Accounts ================= */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Accounts</h3>
                </div>

                <div className="p-3 rounded-lg border text-sm font-medium">
                  {data.accountDetails.sourceAccount} →{" "}
                  {data.accountDetails.targetAccount}
                </div>
              </section>

              <Separator />

              {/* ================= Approval ================= */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">
                    Approval Information
                  </h3>
                </div>

                <InfoCard
                  label="Approved By"
                  value={data.approvalWorkflow.approvedBy ?? "—"}
                />
              </section>

              <Separator />

              {/* ================= Workflow ================= */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Approval Workflow</h3>
                </div>

                <div className="p-3 rounded-lg border text-sm">
                  {data.approvalWorkflow.workflowPath}
                </div>
              </section>

              <Separator />

              {/* ================= Audit Trail ================= */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Audit Trail</h3>
                </div>

                <div className="space-y-2">
                  {data.auditTrail.map((log) => (
                    <div
                      key={log.timestamp}
                      className="p-3 rounded-lg border text-xs"
                    >
                      <div className="font-medium">{log.action}</div>
                      <div className="text-muted-foreground">
                        {formatDate(log.timestamp)} • {log.user}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </ScrollArea>

        {/* ---------------- Footer ---------------- */}
        <div className="px-6 py-3 border-t bg-muted/50">
          <div className="text-xs text-muted-foreground text-center">
            Transaction Record Details
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ---------------- Reusable Card ---------------- */

const InfoCard = ({
  label,
  value,
  icon,
  capitalize,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  capitalize?: boolean;
}) => (
  <div className="space-y-1 p-3 rounded-lg border">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      {label}
    </div>
    <div className={`font-medium text-sm ${capitalize ? "capitalize" : ""}`}>
      {value}
    </div>
  </div>
);
