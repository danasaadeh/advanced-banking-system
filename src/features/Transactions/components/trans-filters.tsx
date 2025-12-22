import React, { useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Filter, ChevronRight, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

import type {
  TransactionType,
  TransactionStatus,
  TransactionDirection,
} from "../types";

/* ---------------- Chip UI ---------------- */
const Chip: React.FC<{ label: string; onRemove?: () => void }> = ({
  label,
  onRemove,
}) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm">
    <span>{label}</span>
    {onRemove && (
      <button onClick={onRemove} className="p-1 rounded-full hover:bg-muted/60">
        <X className="w-3 h-3" />
      </button>
    )}
  </div>
);

/* ---------------- TYPES ---------------- */
interface TransactionFiltersProps {
  dateFrom: string;
  dateTo: string;

  type: "all" | TransactionType;
  status: "all" | TransactionStatus;
  direction: "all" | TransactionDirection;

  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onTypeChange: (v: "all" | TransactionType) => void;
  onStatusChange: (v: "all" | TransactionStatus) => void;
  onDirectionChange: (v: "all" | TransactionDirection) => void;
}

type MenuKey = "type" | "status" | "direction" | null;

/* ---------------- CONSTANTS ---------------- */
const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "transfer", label: "Transfer" },
];

const TRANSACTION_STATUSES: {
  value: TransactionStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

const DIRECTIONS: { value: TransactionDirection; label: string }[] = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  dateFrom,
  dateTo,
  type,
  status,
  direction,
  onDateFromChange,
  onDateToChange,
  onTypeChange,
  onStatusChange,
  onDirectionChange,
}) => {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);

  /* ------------ CHIP LABELS ------------ */
  const typeLabel = useMemo(
    () =>
      type !== "all"
        ? TRANSACTION_TYPES.find((x) => x.value === type)?.label
        : null,
    [type]
  );

  const statusLabel = useMemo(
    () =>
      status !== "all"
        ? TRANSACTION_STATUSES.find((x) => x.value === status)?.label
        : null,
    [status]
  );

  const directionLabel = useMemo(
    () =>
      direction !== "all"
        ? DIRECTIONS.find((x) => x.value === direction)?.label
        : null,
    [direction]
  );

  /* ------------ CLEAR HANDLERS ------------ */
  const clearDates = () => {
    onDateFromChange("");
    onDateToChange("");
  };

  /* ---------------- FLOATING SUBMENU STYLE ---------------- */
  const floatingStyle = "absolute left-[105%] top-0 z-50 shadow-xl";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* MAIN FILTER BUTTON */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[340px] p-0 shadow-xl rounded-xl relative">
            <div className="flex flex-col py-2">
              {/* DATE RANGE */}
              <div className="px-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>From</span>
                  <span>To</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    className="h-9 w-full"
                  />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                    className="h-9 w-full"
                  />
                </div>
              </div>

              {/* TRANSACTION TYPE */}
              <div className="relative">
                <button
                  className="w-full px-4 py-2 flex justify-between items-center hover:bg-muted/20"
                  onClick={() =>
                    setOpenMenu(openMenu === "type" ? null : "type")
                  }
                >
                  Transaction Type <ChevronRight className="w-4 h-4" />
                </button>

                {openMenu === "type" && (
                  <div className={`${floatingStyle} bg-popover rounded-lg p-2`}>
                    <button
                      className={`w-full px-3 py-2 text-left rounded ${
                        type === "all" ? "bg-muted" : "hover:bg-muted/20"
                      }`}
                      onClick={() => {
                        onTypeChange("all");
                        setOpenMenu(null);
                      }}
                    >
                      All Types
                    </button>

                    {TRANSACTION_TYPES.map((t) => (
                      <button
                        key={t.value}
                        className={`w-full px-3 py-2 text-left rounded ${
                          type === t.value ? "bg-muted" : "hover:bg-muted/20"
                        }`}
                        onClick={() => {
                          onTypeChange(t.value);
                          setOpenMenu(null);
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* STATUS */}
              <div className="relative">
                <button
                  className="w-full px-4 py-2 flex justify-between items-center hover:bg-muted/20"
                  onClick={() =>
                    setOpenMenu(openMenu === "status" ? null : "status")
                  }
                >
                  Status <ChevronRight className="w-4 h-4" />
                </button>

                {openMenu === "status" && (
                  <div className={`${floatingStyle} bg-popover rounded-lg p-2`}>
                    <button
                      className={`w-full px-3 py-2 text-left rounded ${
                        status === "all" ? "bg-muted" : "hover:bg-muted/20"
                      }`}
                      onClick={() => {
                        onStatusChange("all");
                        setOpenMenu(null);
                      }}
                    >
                      All Statuses
                    </button>

                    {TRANSACTION_STATUSES.map((s) => (
                      <button
                        key={s.value}
                        className={`w-full px-3 py-2 text-left rounded ${
                          status === s.value ? "bg-muted" : "hover:bg-muted/20"
                        }`}
                        onClick={() => {
                          onStatusChange(s.value);
                          setOpenMenu(null);
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DIRECTION */}
              <div className="relative">
                <button
                  className="w-full px-4 py-2 flex justify-between items-center hover:bg-muted/20"
                  onClick={() =>
                    setOpenMenu(openMenu === "direction" ? null : "direction")
                  }
                >
                  Direction <ChevronRight className="w-4 h-4" />
                </button>

                {openMenu === "direction" && (
                  <div className={`${floatingStyle} bg-popover rounded-lg p-2`}>
                    <button
                      className={`w-full px-3 py-2 text-left rounded ${
                        direction === "all" ? "bg-muted" : "hover:bg-muted/20"
                      }`}
                      onClick={() => {
                        onDirectionChange("all");
                        setOpenMenu(null);
                      }}
                    >
                      All Directions
                    </button>

                    {DIRECTIONS.map((d) => (
                      <button
                        key={d.value}
                        className={`w-full px-3 py-2 text-left rounded ${
                          direction === d.value
                            ? "bg-muted"
                            : "hover:bg-muted/20"
                        }`}
                        onClick={() => {
                          onDirectionChange(d.value);
                          setOpenMenu(null);
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* SELECTED FILTER CHIPS */}
        <div className="flex flex-wrap gap-2">
          {typeLabel && (
            <Chip
              label={`Type: ${typeLabel}`}
              onRemove={() => onTypeChange("all")}
            />
          )}
          {statusLabel && (
            <Chip
              label={`Status: ${statusLabel}`}
              onRemove={() => onStatusChange("all")}
            />
          )}
          {directionLabel && (
            <Chip
              label={`Direction: ${directionLabel}`}
              onRemove={() => onDirectionChange("all")}
            />
          )}
          {(dateFrom || dateTo) && (
            <Chip
              label={`Date: ${dateFrom || "—"} → ${dateTo || "—"}`}
              onRemove={clearDates}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
