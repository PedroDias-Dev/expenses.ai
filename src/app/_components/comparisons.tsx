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
import { Plus } from "lucide-react";
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
    <div className="p-4 transition-all">
      <h1 className="text-3xl font-extrabold mb-6 text-primary underline">
        expenses.ai
      </h1>

      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus color="white" />
          Add New Transactions
        </Button>
      </div>

      {/* Period selector */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-white">
          Select Periods to Compare:
        </h2>
        {Object.entries(
          availablePeriods.reduce((acc, period) => {
            const [year, month] = period.split("-");
            if (!acc[year]) acc[year] = [];
            acc[year].push({ month, period });
            return acc;
          }, {} as Record<string, { month: string; period: string }[]>)
        )
          .sort((a, b) => b[0].localeCompare(a[0])) // Sort years in descending order
          .map(([year, months]) => (
            <div key={year} className="mb-4">
              <h3 className="text-md font-medium mb-2 text-zinc-200">{year}</h3>
              <div className="flex flex-wrap gap-2">
                {months.map(({ month, period }) => (
                  <Button
                    key={period}
                    onClick={() => togglePeriod(period)}
                    className={`${
                      selectedPeriods.includes(period)
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-zinc-700"
                    }`}
                    disabled={isLoading}
                  >
                    {monthsInPortuguese[Number(month)]}
                  </Button>
                ))}
              </div>
            </div>
          ))}
      </div>

      {isLoading ? (
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-zinc-700 p-4 rounded shadow">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28 mt-1" />
                </div>
              ))}
          </div>

          {/* Skeleton for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-zinc-700 p-4 rounded shadow">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="bg-zinc-700 p-4 rounded shadow">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>

          <div className="bg-zinc-700 p-4 rounded shadow mb-8">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>

          <div className="bg-zinc-700 p-4 rounded shadow mb-10">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      ) : null}

      <div className={`${isLoading ? "opacity-0" : null}`}>
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaries.map((summary) => (
            <div
              key={summary.period}
              className="bg-zinc-700  p-4 rounded shadow"
            >
              <h3 className="font-bold text-lg text-white">
                {summary.formattedPeriod}
              </h3>
              <p className="text-2xl font-bold text-primary">
                R$ {summary.total.toFixed(2)}
              </p>
              <p className="text-sm text-zinc-300">
                {summary.count} transactions
                <br />
                Avg: R${summary.avgTransaction.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Total spending by period (Bar chart) */}
          <div className="bg-zinc-700  p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Total Spending by Period
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Total",
                  ]}
                />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average transaction by period (Line chart) */}
          <div className="bg-zinc-700  p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Average Transaction Value
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Average",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgTransaction"
                  stroke="#82ca9d"
                  name="Avg Transaction"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category comparison (Bar chart) */}
        <div className="bg-zinc-700  p-4 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Category Comparison Across Periods
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
              />
              <Legend />
              {selectedPeriods.map((period, index) => (
                <Bar
                  key={period}
                  dataKey={period}
                  fill={COLORS[index % COLORS.length]}
                  name={period}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown for most recent period (Pie chart) */}
        <div className="bg-zinc-700  p-4 rounded shadow mb-10">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {summaries.length > 0
              ? `Category Breakdown (${summaries[summaries.length - 1].period})`
              : "Category Breakdown"}
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
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
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {getSelectedTransactions.length && (
          <Graphs transactions={getSelectedTransactions} />
        )}

        {getSelectedTransactions.length > 0 && (
          <UberAnalysis transactions={getSelectedTransactions} />
        )}
      </div>
    </div>
  );
};

export default TransactionDashboard;
