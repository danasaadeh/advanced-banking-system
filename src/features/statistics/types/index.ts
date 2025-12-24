import type React from "react";

export interface StatisticsOverview {
  total_accounts: number;
  active_accounts: number;
  total_transactions: number;
  total_balance: number;
  pending_transactions: number;
  total_customers: number;
}

export interface MonthlyTransaction {
  month: number;
  month_name: string;
  count: number;
  amount: number;
}

export interface AccountTypeDistribution {
  account_type: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface StatisticsData {
  overview: StatisticsOverview;
  line_chart: MonthlyTransaction[];
  pie_chart: AccountTypeDistribution[];
}

export interface StatisticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}