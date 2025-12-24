"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyTransaction } from "../types";
import { useTranslation } from "react-i18next";

interface TransactionsLineChartProps {
  data: MonthlyTransaction[];
}

export const TransactionsLineChart = ({ data }: TransactionsLineChartProps) => {
  const { t } = useTranslation();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-foreground">
            {payload[0].payload.month_name}
          </p>
          <p className="text-sm text-primary font-medium">
            {t("transactionsCount")}: {payload[0].value}
          </p>
          <p className="text-sm text-green-500 font-medium">
            Amount: ${payload[0].payload.amount.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">
          {t("monthlyTransactions")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              opacity={0.3}
            />
            <XAxis
              dataKey="month_name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => value.substring(0, 3)}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "hsl(var(--primary))" }}
              name={t("transactionsCount")}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};