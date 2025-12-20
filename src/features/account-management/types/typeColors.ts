import type { AccountType, AccountStatus } from "@/features/account-management/types/accounts.data";

/**
 * Mapping account type names to colors
 */
export const typeColors: Record<AccountType["name"], string> = {
  Savings: "bg-emerald-100 text-emerald-700",
  Checking: "bg-blue-100 text-blue-700",
  Family: "bg-purple-100 text-purple-700",
  Investment: "bg-rose-100 text-rose-700",
  Personal: "bg-yellow-100 text-yellow-700",   // added Personal
  Business: "bg-indigo-100 text-indigo-700",   // added Business
};

/**
 * Mapping account statuses to colors
 */
export const statusColors: Record<AccountStatus, string> = {
  active: "text-emerald-700",
  frozen: "text-blue-700",
  suspended: "text-amber-700",
  closed: "text-slate-600",
};

/**
 * Utility to join class names
 */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
