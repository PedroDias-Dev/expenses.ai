/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import MonthlySubscriptions from "./monthly-subscriptions";
import SpendingByCategoryChart from "./spending-by-category";
import TopExpensesChart from "./top-expenses";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-white">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-emerald-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Financial Summary
          </h2>

          <div className="space-y-4 divide-y divide-zinc-700">
            <div className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium">Total Spent</span>
                <span className="font-extrabold text-xl text-white">
                  R$ {totalSpent.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium">
                  Credit Card Payments
                </span>
                <span className="font-extrabold text-xl text-white">
                  R$ {creditCardPayments.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium">
                  Monthly Subscriptions
                </span>
                <div className="text-right">
                  <span className="font-extrabold text-xl text-white block">
                    R$ {totalSubscriptions.toFixed(2)}
                  </span>
                  <span className="text-sm text-emerald-400">
                    {((totalSubscriptions / totalSpent) * 100).toFixed(1)}% of
                    total
                  </span>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium">Top Expense</span>
                <div className="text-right">
                  <span className="font-bold text-white block">
                    {top10Expenses[0].description}
                  </span>
                  <span className="font-extrabold text-lg text-emerald-400">
                    R$ {top10Expenses[0].value.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-medium">Top Category</span>
                <div className="text-right">
                  <span className="font-bold text-white block">
                    {categoryData[0].name}
                  </span>
                  <span className="font-extrabold text-lg text-emerald-400">
                    R$ {categoryData[0].value.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MonthlySubscriptions subscriptions={monthlySubscriptions} />
      </div>
      <div className="flex flex-col gap-6">
        <SpendingByCategoryChart
          categoryData={categoryData.map((item) => ({
            name: item.name,
            value: item.value,
            color: COLORS[categoryData.indexOf(item) % COLORS.length],
          }))}
        />

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Transportation Breakdown</h2>
            <div className="bg-zinc-700/50 px-3 py-1 rounded-full text-xs font-medium">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

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
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {transportData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Additional information section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <h3 className="text-zinc-400 text-sm font-medium mb-1">
                Total Expenses
              </h3>
              <p className="text-2xl font-bold">
                R${" "}
                {transportData
                  .reduce(
                    (sum: number, item: { value: number }) => sum + item.value,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <h3 className="text-zinc-400 text-sm font-medium mb-1">
                Highest Category
              </h3>
              <p className="text-2xl font-bold">
                {
                  transportData.reduce((prev: any, current: any) =>
                    prev.value > current.value ? prev : current
                  ).name
                }
              </p>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
              <h3 className="text-zinc-400 text-sm font-medium mb-1">
                Categories
              </h3>
              <p className="text-2xl font-bold">{transportData.length}</p>
            </div>
          </div>

          {/* Legend section */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {transportData.map(
              (entry: { name: string; value: number }, index: number) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="ml-auto text-sm text-zinc-400">
                    R$ {entry.value.toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <TopExpensesChart expenses={top10Expenses} />
      </div>
    </>
  );
};

export default Graphs;
