/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Graphs = ({ transactions }: { transactions: any }) => {
  // Raw transaction data

  // Filter out card payment transactions
  const filteredTransactions = transactions.filter(
    (t: { description: string; category: string }) =>
      !(t.description === "PAGAMENTO ON LINE" && t.category === "OUTROS")
  );

  // Calculate total amount of credit card payments
  const creditCardPayments = transactions
    .filter(
      (t: { description: string; category: string }) =>
        t.description === "PAGAMENTO ON LINE" && t.category === "OUTROS"
    )
    .reduce((sum: any, t: { value: any }) => sum + t.value, 0);

  // Define monthly subscription expenses
  const monthlySubscriptions = [
    { description: "SELFITSANTACLARA", value: 99.9, category: "FITNESS" },
    {
      description: "Wellhub Gympass BR Gym",
      value: 189.9,
      category: "FITNESS",
    },
    {
      description: "SPLICE COM  SPLICE PLA",
      value: 77.03,
      category: "ENTERTAINMENT",
    },
    { description: "CONTA VIVO", value: 245.81, category: "TELECOM" },
  ];

  // Group transactions by category and calculate totals
  const categoryTotals: Record<string, number> = {};
  filteredTransactions.forEach(
    (t: { description: string; category: string | number; value: number }) => {
      if (t.description !== "PAGAMENTO ON LINE") {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += t.value;
      }
    }
  );

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  // Get top 10 individual expenses
  const top10Expenses = [...filteredTransactions]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Group transportation expenses
  const transportExpenses: Record<string, number> = filteredTransactions
    .filter((t: { category: string }) => t.category === "TRANSPORTE")
    .reduce(
      (
        acc: { [x: string]: any },
        t: { description: string | string[]; value: any }
      ) => {
        const provider = t.description.includes("UBER")
          ? "Uber"
          : t.description.includes("RECARGAPAY")
          ? "Public Transport"
          : t.description.includes("BRISTOL")
          ? "Gas"
          : "Other";
        if (!acc[provider]) acc[provider] = 0;
        acc[provider] += t.value;
        return acc;
      },
      {} as Record<string, number>
    );

  const transportData = Object.entries(transportExpenses)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  // Calculate total spent (excluding credit card payments)
  const totalSpent = filteredTransactions
    .filter(
      (t: { description: string }) => t.description !== "PAGAMENTO ON LINE"
    )
    .reduce((sum: any, t: { value: any }) => sum + t.value, 0);

  // Calculate total subscriptions
  const totalSubscriptions = monthlySubscriptions.reduce(
    (sum, sub) => sum + sub.value,
    0
  );

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFF",
    "#FF6B6B",
    "#4ECDC4",
    "#C7F464",
    "#FF6B6B",
    "#A463F2",
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-zinc-200  p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Total Spent:</span>{" "}
              <b className="font-extrabold text-lg">
                R$ {totalSpent.toFixed(2)}
              </b>
            </p>
            <p>
              <span className="font-medium">Total Credit Card Payments:</span>{" "}
              <b className="font-extrabold text-lg">
                R$ {creditCardPayments.toFixed(2)}
              </b>
            </p>
            <p>
              <span className="font-medium">Monthly Subscriptions:</span>{" "}
              <b className="font-extrabold text-lg">
                R$ {totalSubscriptions.toFixed(2)}
              </b>{" "}
              ({((totalSubscriptions / totalSpent) * 100).toFixed(1)}% of total)
            </p>
            <p>
              <span className="font-medium">Top Expense:</span>{" "}
              {top10Expenses[0].description}{" "}
              <b className="font-extrabold text-lg">
                (R$ {top10Expenses[0].value.toFixed(2)})
              </b>
            </p>
            <p>
              <span className="font-medium">Top Category:</span>{" "}
              <b className="font-extrabold text-lg">
                {categoryData[0].name} (R${" "}
                {(categoryData[0].value as number).toFixed(2)})
              </b>
            </p>
          </div>
        </div>

        <div className="bg-zinc-200  p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Monthly Subscriptions</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySubscriptions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="description" />
                <YAxis />
                <Tooltip
                  formatter={(value: string) => [
                    `R$ ${Number(value).toFixed(2)}`,
                    "Value",
                  ]}
                />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-rows-2 gap-6 mb-6">
        <div className="bg-zinc-200  p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Spending by Category</h2>
          <div className="h-full">
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: string) =>
                    `R$ ${Number(value).toFixed(2)}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-200  p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Transportation Breakdown
          </h2>
          <div className="h-fit">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {transportData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: string) =>
                    `R$ ${Number(value).toFixed(2)}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-zinc-200  p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Top 10 Expenses</h2>
        <div className="h-full">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={top10Expenses}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="description"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: string) => [
                  `R$ ${Number(value).toFixed(2)}`,
                  "Value",
                ]}
              />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Graphs;
