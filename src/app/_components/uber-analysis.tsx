"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define types for our data
interface Transaction {
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
}

interface UberAnalysisProps {
  transactions: Transaction[];
}

const UberAnalysis = ({ transactions }: UberAnalysisProps) => {
  // Filter for Uber transactions only
  const uberTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes("uber") ||
        t.category.toLowerCase().includes("uber") ||
        t.category.toLowerCase().includes("ride")
    );
  }, [transactions]);

  // Group Uber transactions by month
  const uberByMonth = useMemo(() => {
    const grouped = uberTransactions.reduce(
      (acc, transaction) => {
        const period = transaction.date;

        if (!acc[period]) {
          acc[period] = {
            period,
            formattedPeriod: period,
            totalSpent: 0,
            tripCount: 0,
            avgTripCost: 0,
            weekdayTrips: 0,
            weekendTrips: 0,
          };
        }

        // Add to total
        acc[period].totalSpent += transaction.value;
        acc[period].tripCount += 1;

        // Check if weekend (0 = Sunday, 6 = Saturday)
        const date = new Date(transaction.date);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          acc[period].weekendTrips += 1;
        } else {
          acc[period].weekdayTrips += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          period: string;
          formattedPeriod: string;
          totalSpent: number;
          tripCount: number;
          avgTripCost: number;
          weekdayTrips: number;
          weekendTrips: number;
        }
      >
    );

    // Calculate averages and format
    Object.values(grouped).forEach((month) => {
      month.avgTripCost = month.tripCount
        ? parseFloat((month.totalSpent / month.tripCount).toFixed(2))
        : 0;
      month.totalSpent = parseFloat(month.totalSpent.toFixed(2));
    });

    return Object.values(grouped).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  }, [uberTransactions]);

  // Stats for all time
  const uberStats = useMemo(() => {
    if (uberTransactions.length === 0) return null;

    const totalSpent = uberTransactions.reduce((sum, t) => sum + t.value, 0);
    const avgTripCost = totalSpent / uberTransactions.length;

    // Time of day analysis
    const timeOfDayCount = {
      morning: 0, // 5am-12pm
      afternoon: 0, // 12pm-5pm
      evening: 0, // 5pm-9pm
      night: 0, // 9pm-5am
    };

    uberTransactions.forEach((t) => {
      const date = new Date(t.date);
      const hour = date.getHours();

      if (hour >= 5 && hour < 12) timeOfDayCount.morning += 1;
      else if (hour >= 12 && hour < 17) timeOfDayCount.afternoon += 1;
      else if (hour >= 17 && hour < 21) timeOfDayCount.evening += 1;
      else timeOfDayCount.night += 1;
    });

    return {
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      tripCount: uberTransactions.length,
      avgTripCost: parseFloat(avgTripCost.toFixed(2)),
      timeOfDay: timeOfDayCount,
    };
  }, [uberTransactions]);

  const getMostCommonTime = () => {
    if (!uberStats) return;

    return Object.entries(uberStats.timeOfDay).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  };

  if (uberTransactions.length === 0) {
    return (
      <div className="bg-zinc-700 p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Uber Analysis</h2>
        <p>No Uber transactions found in the selected period.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 text-white">
      <h1 className="text-xl font-bold mb-6 text-white">Uber Trip Analysis</h1>

      {/* Stats overview */}
      {uberStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-7 rounded-2xl shadow-xl border border-zinc-700/50 backdrop-blur-sm hover:border-zinc-600 transition-all duration-300 group">
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Total Uber Spending
              </h3>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                R$ {uberStats.totalSpent.toFixed(2)}
              </p>
              <div className="flex items-center mt-2">
                <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs font-medium text-zinc-200">
                  {uberStats.tripCount} total trips
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-7 rounded-2xl shadow-xl border border-zinc-700/50 backdrop-blur-sm hover:border-zinc-600 transition-all duration-300 group">
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Average Trip Cost
              </h3>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                R$ {uberStats.avgTripCost.toFixed(2)}
              </p>
              <div className="flex items-center mt-2">
                <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs font-medium text-zinc-200">
                  per ride
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-7 rounded-2xl shadow-xl border border-zinc-700/50 backdrop-blur-sm hover:border-zinc-600 transition-all duration-300 group">
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Most Common Time
              </h3>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                {getMostCommonTime()}
              </p>
              <div className="flex items-center mt-2">
                <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs font-medium text-zinc-200">
                  for Uber rides
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Uber expenses chart */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 mb-8">
        <h2 className="text-lg font-semibold mb-4">Uber Expenses by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uberByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`R$${value.toFixed(2)}`, "Total"]}
            />
            <Legend />
            <Bar
              dataKey="totalSpent"
              fill="#00539c"
              name="Total Uber Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average trip cost trend */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Average Uber Trip Cost Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={uberByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value: number) => [
                `R$${value.toFixed(2)}`,
                "Average",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgTripCost"
              stroke="#5c55df"
              name="Avg Trip Cost"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="tripCount"
              stroke="#e99c76"
              name="Number of Trips"
              strokeWidth={2}
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekday vs Weekend comparison */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Weekday vs Weekend Uber Usage
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uberByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="weekdayTrips" fill="#00C49F" name="Weekday Trips" />
            <Bar dataKey="weekendTrips" fill="#FFBB28" name="Weekend Trips" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UberAnalysis;
