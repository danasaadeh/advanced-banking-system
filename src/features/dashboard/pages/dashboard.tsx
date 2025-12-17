import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAuthStore } from "@/stores/use-auth-store";

const stats = [
  {
    title: "Total Balance",
    value: "$2,459,812.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Accounts",
    value: "12,847",
    change: "+3.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Today's Transactions",
    value: "1,429",
    change: "+18.7%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-5.1%",
    trend: "down",
    icon: TrendingDown,
  },
];

const recentTransactions = [
  {
    id: 1,
    type: "Deposit",
    account: "SA-2847",
    amount: "+$5,200.00",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Withdrawal",
    account: "CH-9182",
    amount: "-$1,800.00",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "Transfer",
    account: "SA-1029",
    amount: "-$3,450.00",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "Deposit",
    account: "LN-5728",
    amount: "+$12,000.00",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "Withdrawal",
    account: "CH-3847",
    amount: "-$750.00",
    time: "3 hours ago",
  },
];

const OverviewPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your banking system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-destructive" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.amount.startsWith("+") ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    {tx.amount.startsWith("+") ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.account}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.amount.startsWith("+")
                        ? "text-success"
                        : "text-foreground"
                    }`}
                  >
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
