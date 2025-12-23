/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Users, Activity, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import TransactionsTable from "../components/TransactionsTable";
import HeaderActions from "../components/HeaderActions";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        overview: {
          total_accounts: 1250,
          active_accounts: 1180,
          total_balance: 5240600,
          pending_transactions: 14,
        },
        recentTransactions: [
          {
            id: 1,
            type: "Deposit",
            amount: 500,
            status: "Completed",
            date: "2025-12-22",
          },
          {
            id: 2,
            type: "Transfer",
            amount: 1200,
            status: "Pending",
            date: "2025-12-23",
          },
          {
            id: 3,
            type: "Withdrawal",
            amount: 100,
            status: "Completed",
            date: "2025-12-23",
          },
        ],
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    if (!data) return;
    const csvRows = [
      ["Type", "Amount", "Status", "Date"],
      ...data.recentTransactions.map((tx: any) => [
        tx.type,
        tx.amount,
        tx.status,
        tx.date,
      ]),
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions_report.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Banking Intelligence
            </h1>
            <p className="text-muted-foreground">
              System Monitoring & Audit Dashboard
            </p>
          </div>
          <HeaderActions onExport={handleExport} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Liquidity"
            value={`$${data.overview.total_balance.toLocaleString()}`}
            icon={<Wallet className="text-primary" />}
            description="Across Savings & Checking"
          />
          <StatCard
            title="Total Accounts"
            value={data.overview.total_accounts}
            icon={<Users className="text-primary" />}
            description="All account hierarchies"
          />
          <StatCard
            title="Active Status"
            value={data.overview.active_accounts}
            icon={<Activity className="text-primary" />}
            description="Currently active sessions"
          />
          <StatCard
            title="Pending Queue"
            value={data.overview.pending_transactions}
            icon={<Clock className="text-primary" />}
            description="Awaiting manager approval"
          />
        </div>

        {/* Table Section */}
        <TransactionsTable transactions={data.recentTransactions} />
      </div>
    </div>
  );
}
