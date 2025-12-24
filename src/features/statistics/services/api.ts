import type { StatisticsData } from "../types";

class StatisticsService {
  async getStatistics(): Promise<StatisticsData> {
    // Mock data - بنفس نمط بيانات الشكاوى
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Generate line chart data for last 6 months
    const line_chart = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return {
        month: monthIndex + 1,
        month_name: months[monthIndex],
        count: Math.floor(Math.random() * 500) + 200,
        amount: Math.floor(Math.random() * 1000000) + 500000
      };
    });

    // Pie chart data - أنواع الحسابات
    const pie_chart = [
      {
        account_type: "Savings",
        count: 1245,
        percentage: 45
      },
      {
        account_type: "Checking", 
        count: 890,
        percentage: 32
      },
      {
        account_type: "Loan",
        count: 320,
        percentage: 12
      },
      {
        account_type: "Investment",
        count: 210,
        percentage: 8
      },
      {
        account_type: "Business",
        count: 135,
        percentage: 5
      }
    ];

    return {
      overview: {
        total_accounts: 2800,
        active_accounts: 2650,
        total_transactions: 15420,
        total_balance: 90000000,
        pending_transactions: 47,
        total_customers: 1850
      },
      line_chart,
      pie_chart
    };
  }
}

export const statisticsService = new StatisticsService();