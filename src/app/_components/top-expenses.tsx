import React, { useState } from "react";
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

interface Expense {
  id: string;
  description: string;
  value: number;
  date: string;
  category?: string;
}

interface TopExpensesProps {
  expenses: Expense[];
  className?: string;
}

const TopExpensesChart: React.FC<TopExpensesProps> = ({
  expenses,
  className,
}) => {
  const [hoveredBar, setHoveredBar] = useState<Expense | null>(null);

  // Calculate total value of top expenses
  const totalValue = expenses.reduce((sum, expense) => sum + expense.value, 0);

  // Format currency
  const formatCurrency = (value: number): string => {
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div
      className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 sm:p-6 rounded-xl shadow-lg border border-zinc-700 text-white ${className}`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-xl font-semibold">Top 10 Expenses</h2>
        <div className="text-sm text-zinc-400 mt-1 md:mt-0">
          Total:{" "}
          <span className="text-emerald-400 font-medium">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={expenses}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            onMouseMove={(data) => {
              if (data.activeTooltipIndex !== undefined) {
                setHoveredBar(expenses[data.activeTooltipIndex]);
              }
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.3} />
            <XAxis
              type="number"
              tick={{ fill: "#d1d5db" }}
              tickFormatter={(value) =>
                `R$ ${value.toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                })}`
              }
            />
            <YAxis
              type="category"
              dataKey="description"
              width={90}
              tick={{ fontSize: 11, fill: "#d1d5db" }}
              tickFormatter={(value) =>
                value.length > 16 ? `${value.substring(0, 16)}...` : value
              }
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Value"]}
              contentStyle={{
                backgroundColor: "#27272a",
                border: "1px solid #52525b",
                borderRadius: "0.375rem",
              }}
              cursor={{ fill: "rgba(134, 239, 172, 0.1)" }}
              labelStyle={{ color: "#f4f4f5" }}
            />
            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              barSize={25}
              animationDuration={1000}
            ></Bar>
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional info section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-zinc-700 pt-4">
        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <h3 className="text-zinc-400 mb-1">Highest Expense</h3>
          <div className="font-medium">
            {expenses.length > 0 ? expenses[0].description : "N/A"}
          </div>
          <div className="text-emerald-400 font-semibold">
            {expenses.length > 0 ? formatCurrency(expenses[0].value) : "N/A"}
          </div>
        </div>

        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <h3 className="text-zinc-400 mb-1">Average Value</h3>
          <div className="text-emerald-400 font-semibold">
            {expenses.length > 0
              ? formatCurrency(totalValue / expenses.length)
              : "N/A"}
          </div>
        </div>

        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <h3 className="text-zinc-400 mb-1">Selected Expense</h3>
          {hoveredBar ? (
            <>
              <div className="font-medium truncate">
                {hoveredBar.description}
              </div>
              <div className="text-emerald-400 font-semibold">
                {formatCurrency(hoveredBar.value)}
              </div>
              <div className="text-zinc-500 text-xs">
                {new Date(hoveredBar.date).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div className="text-zinc-500">Hover over a bar to see details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopExpensesChart;
