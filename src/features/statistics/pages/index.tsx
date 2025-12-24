"use client";

import { useApiQuery } from "@/lib/query-facade";
import { statisticsService } from "../services/api";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { StatisticsCard } from "../components/kpi-cards";
import { TransactionsLineChart } from "../components/line-chart";
import { AccountDistributionChart } from "../components/pie-chart";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const StatisticsPage = () => {
  const { t } = useTranslation();
  
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    key: ["statistics", "dashboard"],
    fetcher: () => statisticsService.getStatistics(),
    successMessage: t("statisticsLoaded"),
    errorMessage: t("failedToLoadStatistics"),
    hideSuccessToast: true, 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loadingStatistics")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : t("failedToLoadStatistics")}
            <button
              onClick={() => refetch()}
              className="ml-4 text-sm underline hover:text-primary"
            >
              {t("tryAgain")}
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{t("bankStatistics")}</h1>
        <p className="text-muted-foreground">{t("statisticsDescription")}</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatisticsCard
          title={t("totalAccounts")}
          value={data.overview.total_accounts}
          icon={<CreditCard className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatisticsCard
          title={t("activeAccounts")}
          value={data.overview.active_accounts}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatisticsCard
          title={t("totalCustomers")}
          value={data.overview.total_customers}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatisticsCard
          title={t("totalBalance")}
          value={data.overview.total_balance}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatisticsCard
          title={t("totalTransactions")}
          value={data.overview.total_transactions}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 18, isPositive: true }}
        />
        <StatisticsCard
          title={t("pendingTransactions")}
          value={data.overview.pending_transactions}
          icon={<Clock className="w-5 h-5" />}
          trend={{ value: -3, isPositive: false }}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TransactionsLineChart data={data.line_chart} />
        <AccountDistributionChart data={data.pie_chart} />
      </div>

      {/* SUMMARY CARD */}
      <div className="mt-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              {t("quickSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">{t("activeRate")}</p>
                <p className="text-2xl font-bold text-primary">
                  {((data.overview.active_accounts / data.overview.total_accounts) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("avgBalancePerAccount")}</p>
                <p className="text-2xl font-bold text-primary">
                  ${Math.round(data.overview.total_balance / data.overview.total_accounts).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("transactionsPerDay")}</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(data.overview.total_transactions / 30).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("avgAccountsPerCustomer")}</p>
                <p className="text-2xl font-bold text-primary">
                  {(data.overview.total_accounts / data.overview.total_customers).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};