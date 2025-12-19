import type { AccountType, AccountStatus } from "@/features/account-management/pages/accounts.data";

export const typeColors: Record<AccountType, string> = {
  Savings: "bg-emerald-100 text-emerald-700",
  Checking: "bg-blue-100 text-blue-700",
  Family: "bg-purple-100 text-purple-700",
  Investment: "bg-rose-100 text-rose-700",
};

export const statusColors: Record<AccountStatus, string> = {
  active: "text-emerald-700",
  inactive: "text-amber-700",
  closed: "text-slate-600",
};

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
