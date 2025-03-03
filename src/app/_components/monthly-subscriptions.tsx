import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";

interface Subscription {
  description: string;
  value: number;
  category: string;
}

interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

interface MonthlySubscriptionsProps {
  subscriptions: Subscription[];
}

const MonthlySubscriptions: React.FC<MonthlySubscriptionsProps> = ({
  subscriptions,
}) => {
  // Calculate statistics for the subscriptions
  const stats = useMemo(() => {
    const total = subscriptions.reduce((sum, sub) => sum + sub.value, 0);

    // Group by category
    const categoryTotals: CategoryTotal[] = Object.values(
      subscriptions.reduce<Record<string, CategoryTotal>>((acc, sub) => {
        if (!acc[sub.category]) {
          acc[sub.category] = {
            category: sub.category,
            total: 0,
            percentage: 0,
          };
        }
        acc[sub.category].total += sub.value;
        return acc;
      }, {})
    ).map((cat) => ({
      ...cat,
      percentage: (cat.total / total) * 100,
    }));

    return {
      total,
      categoryTotals,
      count: subscriptions.length,
      average: total / subscriptions.length,
    };
  }, [subscriptions]);

  // Custom colors based on category
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      FITNESS: "#4ade80",
      ENTERTAINMENT: "#f87171",
      TELECOM: "#60a5fa",
      DEFAULT: "#8884d8",
    };

    return colors[category] || colors.DEFAULT;
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 text-white">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        Monthly Subscriptions
      </h2>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subscriptions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="description"
              tick={{ fill: "#d1d5db", fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.substring(0, 10)}...` : value
              }
            />
            <YAxis
              tick={{ fill: "#d1d5db", fontSize: 12 }}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#27272a",
                border: "none",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Value"]}
              labelStyle={{
                color: "#d1d5db",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Legend />
            <Bar
              dataKey="value"
              name="Subscription Cost"
              radius={[4, 4, 0, 0]}
              fill="#8884d8"
              fillOpacity={0.9}
              barSize={40}
              animationDuration={1500}
              animationEasing="ease-in-out"
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Total Monthly Cost:</span>
              <span className="font-semibold text-emerald-400">
                R$ {stats.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Number of Subscriptions:</span>
              <span className="font-semibold">{stats.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">
                Average Cost per Subscription:
              </span>
              <span className="font-semibold">
                R$ {stats.average.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {stats.categoryTotals.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300 flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: getCategoryColor(cat.category),
                      }}
                    />
                    {cat.category}
                  </span>
                  <span className="font-semibold">
                    R$ {cat.total.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: getCategoryColor(cat.category),
                    }}
                  />
                </div>
                <div className="text-xs text-zinc-400 text-right">
                  {cat.percentage.toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-zinc-400 text-center">
        Data last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default MonthlySubscriptions;
