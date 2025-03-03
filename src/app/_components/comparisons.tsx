"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Graphs from "./graphs";
import { monthsInPortuguese } from "@/helpers/dates";
import UberAnalysis from "./uber-analysis";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChartIcon,
  CalendarIcon,
  Check,
  CreditCardIcon,
  FolderIcon,
  LineChartIcon,
  PieChartIcon,
  Plus,
  TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionsByPeriod } from "@/types/transaction";
import {
  CategorySums,
  ChartDataItem,
  PeriodSummary,
  PieChartDataItem,
} from "@/types/chart";

const COLORS = [
  "#00539c",
  "#00C49F",
  "#FFBB28",
  "#e99c76",
  "#5c55df",
  "#82ca9d",
];
const TransactionDashboard = ({
  transactions,
  setShowUploadModal,
}: {
  transactions: TransactionsByPeriod;
  setShowUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // State for period selection
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Parse and organize transaction data by period
  useEffect(() => {
    if (transactions) {
      // Extract all unique periods (month-year)
      const periods = Object.keys(transactions);
      setAvailablePeriods(periods);

      // Default to selecting all periods (or the most recent ones if there are many)
      setSelectedPeriods(periods.length > 4 ? periods.slice(-4) : periods);
    }
  }, [transactions]);

  // Calculate summaries for selected periods
  const summaries = useMemo((): PeriodSummary[] => {
    if (!selectedPeriods.length || !transactions) return [];

    return selectedPeriods.map((period) => {
      const periodTransactions = transactions[period] || [];

      // Calculate total spent
      const total = periodTransactions.reduce((sum, t) => sum + t.value, 0);

      // Group by category
      const categorySums = periodTransactions.reduce(
        (acc: CategorySums, t: Transaction) => {
          acc[t.category] = (acc[t.category] || 0) + t.value;
          return acc;
        },
        {}
      );

      // Count transactions
      const count = periodTransactions.length;

      const [year, month] = period.split("-");
      const formattedPeriod = `${year} - ${monthsInPortuguese[Number(month)]}`;

      return {
        period,
        formattedPeriod,
        total: parseFloat(total.toFixed(2)),
        categorySums,
        count,
        avgTransaction: count ? parseFloat((total / count).toFixed(2)) : 0,
      };
    });
  }, [selectedPeriods, transactions]);

  // Prepare data for the bar chart (total by period)
  const barChartData = useMemo((): ChartDataItem[] => {
    return summaries.map((s) => ({
      period: s.period,
      total: s.total,
    }));
  }, [summaries]);

  // Prepare data for line chart (average transaction value by period)
  const lineChartData = useMemo((): ChartDataItem[] => {
    return summaries
      .slice()
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((s) => ({
        period: s.period,
        avgTransaction: s.avgTransaction,
      }));
  }, [summaries]);

  // Prepare data for category comparison
  const categoryComparisonData = useMemo((): ChartDataItem[] => {
    // Get all unique categories
    const allCategories = new Set<string>();
    summaries.forEach((s) => {
      Object.keys(s.categorySums).forEach((cat) => allCategories.add(cat));
    });

    // Create array of categories with values for each period
    return Array.from(allCategories).map((category) => {
      const data: ChartDataItem = { category };
      summaries.forEach((s) => {
        data[s.period] = s.categorySums[category] || 0;
      });
      return data;
    });
  }, [summaries]);

  // Prepare pie chart data for most recent period
  const pieChartData = useMemo((): PieChartDataItem[] => {
    if (summaries.length === 0) return [];

    const mostRecent = summaries[summaries.length - 1];
    return Object.entries(mostRecent.categorySums).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [summaries]);

  // Handle period selection
  const togglePeriod = (period: string) => {
    setIsLoading(true);

    // Update the selected periods
    const newSelectedPeriods = selectedPeriods.includes(period)
      ? selectedPeriods.filter((p) => p !== period)
      : [...selectedPeriods, period];

    setSelectedPeriods(newSelectedPeriods);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  // Get all transactions from selected periods
  const getSelectedTransactions = useMemo((): Transaction[] => {
    if (!transactions) return [];

    return selectedPeriods.reduce<Transaction[]>((acc, period) => {
      if (transactions[period]) {
        return [...acc, ...transactions[period]];
      }
      return acc;
    }, []);
  }, [transactions, selectedPeriods]);

  if (!transactions) {
    return <div>Loading data...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8 transition-all max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-white">
          Your Financial Dashboard
        </h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Transactions
        </Button>
      </div>

      {/* Period selector with improved styling */}
      <div className="mb-8 bg-zinc-800/80 p-6 rounded-xl shadow-lg border border-zinc-700/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
          Select Periods to Compare
        </h2>
        <div className="space-y-5">
          {Object.entries(
            availablePeriods.reduce<
              Record<string, { month: string; period: string }[]>
            >((acc, period) => {
              const [year, month] = period.split("-");
              if (!acc[year]) acc[year] = [];
              acc[year].push({ month, period });
              return acc;
            }, {})
          )
            .sort((a, b) => b[0].localeCompare(a[0])) // Sort years in descending order
            .map(([year, months]) => (
              <div key={year} className="mb-4">
                <h3 className="text-md font-medium mb-3 text-zinc-200 border-b border-zinc-700 pb-2">
                  {year}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {months.map(({ month, period }) => {
                    const isSelected = selectedPeriods.includes(period);
                    return (
                      <Button
                        key={period}
                        onClick={() => togglePeriod(period)}
                        variant={isSelected ? "default" : "outline"}
                        className={`transition-all duration-300 ${
                          isSelected
                            ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                            : "hover:bg-zinc-700 border-zinc-600"
                        }`}
                        disabled={isLoading}
                      >
                        {isSelected && <Check className="mr-1 h-3 w-3" />}
                        {monthsInPortuguese[Number(month)]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm"
                >
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28 mt-1" />
                </div>
              ))}
          </div>

          {/* Skeleton for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
          </div>

          <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>

          <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-[500px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {summaries.map((summary) => (
              <div
                key={summary.period}
                className="bg-zinc-800/90 p-6 rounded-2xl shadow-lg border border-zinc-700/60 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] hover:bg-zinc-800 group relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <h3 className="font-bold text-lg text-white mb-3 flex items-center">
                  <CalendarIcon className="mr-2.5 h-5 w-5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                  {summary.formattedPeriod}
                </h3>

                <p className="text-3xl font-extrabold text-primary mb-4 flex items-end group-hover:scale-105 transform transition-transform origin-left duration-300">
                  R$ {summary.total.toFixed(2)}
                  <span className="text-xs ml-2.5 font-normal text-zinc-400">
                    total
                  </span>
                </p>

                <div className="text-sm text-zinc-300 flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-700/50">
                  <div className="flex items-center">
                    <CreditCardIcon className="mr-2.5 h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300" />
                    <span className="group-hover:text-zinc-200 transition-colors duration-300">
                      {summary.count} transactions
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUpIcon className="mr-2.5 h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300" />
                    <span className="group-hover:text-zinc-200 transition-colors duration-300">
                      Avg: R$ {summary.avgTransaction.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Total spending by period */}
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
                <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
                Total Spending by Period
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="period" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    formatter={(value: number) => [
                      `R$${value.toFixed(2)}`,
                      "Total",
                    ]}
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    fill="#8884d8"
                    name="Total Spent"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average transaction by period */}
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5 text-primary" />
                Average Transaction Value
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="period" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    formatter={(value: number) => [
                      `R$${value.toFixed(2)}`,
                      "Average",
                    ]}
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTransaction"
                    stroke="#82ca9d"
                    name="Avg Transaction"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category comparison */}
          <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
              <FolderIcon className="mr-2 h-5 w-5 text-primary" />
              Category Comparison Across Periods
            </h2>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="category" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      formatter={(value: number) => [
                        `R$${value.toFixed(2)}`,
                        "Spent",
                      ]}
                      contentStyle={{
                        backgroundColor: "#333",
                        border: "none",
                        borderRadius: "4px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                      }}
                    />
                    <Legend />
                    {selectedPeriods.map((period, index) => (
                      <Bar
                        key={period}
                        dataKey={period}
                        fill={COLORS[index % COLORS.length]}
                        name={period}
                        radius={[6, 6, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category breakdown pie chart */}
          <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
              {summaries.length > 0
                ? `Category Breakdown (${
                    summaries[summaries.length - 1].formattedPeriod
                  })`
                : "Category Breakdown"}
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `R$${value.toFixed(2)}`,
                    "Spent",
                  ]}
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {getSelectedTransactions.length > 0 && (
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <Graphs transactions={getSelectedTransactions} />
            </div>
          )}

          {getSelectedTransactions.length > 0 && (
            <div className="bg-zinc-800/80 p-6 rounded-xl shadow-md border border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <UberAnalysis transactions={getSelectedTransactions} />
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default TransactionDashboard;
