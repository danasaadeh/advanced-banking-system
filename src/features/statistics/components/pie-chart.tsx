"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { AccountTypeDistribution } from "../types";
import { useTranslation } from "react-i18next";

interface AccountDistributionChartProps {
  data: AccountTypeDistribution[];
}


const COLORS = [
  "hsl(0, 0%, 20%)",    
  "hsl(0, 0%, 35%)",    
  "hsl(0, 0%, 50%)",   
  "hsl(0, 0%, 65%)",    
  "hsl(0, 0%, 80%)",    
];

export const AccountDistributionChart = ({ data }: AccountDistributionChartProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-foreground mb-1">
            {item?.account_type || "Unknown"}
          </p>
          <p className="text-sm text-primary">
            {t("accountsCount")}: {item?.count || 0}
          </p>
          <p className="text-sm text-primary">{item?.percentage || 0}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">{t("accountsByType")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align={isRTL ? "left" : "right"}
              verticalAlign="middle"
              wrapperStyle={{
                paddingLeft: isRTL ? "0" : "20px",
                paddingRight: isRTL ? "20px" : "0",
                fontSize: "12px",
                direction: isRTL ? "rtl" : "ltr",
              }}
              formatter={(value, entry: any) => {
                if (!entry?.payload) {
                  return `${value || "Unknown"} (0)`;
                }
                return `${entry.payload.account_type || "Unknown"} (${entry.payload.count || 0})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};