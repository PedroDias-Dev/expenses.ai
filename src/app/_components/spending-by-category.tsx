import React, { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Define type for category data
interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Define props for the component
interface SpendingByCategoryProps {
  categoryData: CategoryData[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A569BD",
  "#5DADE2",
  "#58D68D",
];

const SpendingByCategoryChart: React.FC<SpendingByCategoryProps> = ({
  categoryData,
}) => {
  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  // Sort data from highest to lowest for the summary
  const sortedData = [...categoryData].sort((a, b) => b.value - a.value);

  // Calculate percentages for each category
  const dataWithPercentages = sortedData.map((item) => ({
    ...item,
    percentage: ((item.value / totalSpent) * 100).toFixed(1),
  }));

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Spending by Category
      </h2>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={150}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              onMouseEnter={handlePieEnter}
              onMouseLeave={handlePieLeave}
              animationDuration={750}
              animationBegin={0}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                  stroke="#272727"
                  strokeWidth={activeIndex === index ? 2 : 0}
                  className="transition-all duration-300"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "rgba(23, 23, 23, 0.9)",
                borderRadius: "8px",
                border: "1px solid #3f3f46",
                color: "#ffffff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Legend
              formatter={(value) => <span className="text-white">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 border-t border-zinc-700 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-zinc-400 mb-2">Total Spent</p>
            <p className="text-2xl font-bold text-white">
              R$ {totalSpent.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-zinc-400 mb-2">Top Category</p>
            <p className="text-2xl font-bold text-white">
              {dataWithPercentages[0]?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold text-white mb-3">Breakdown</h4>
          <div className="space-y-2">
            {dataWithPercentages.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        category.color || COLORS[index % COLORS.length],
                    }}
                  />
                  <span className="text-zinc-300">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400">{category.percentage}%</span>
                  <span className="text-white font-medium">
                    R$ {category.value.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <h4 className="text-sm uppercase text-zinc-500 font-semibold mb-2">
            Insights
          </h4>
          <p className="text-zinc-300">
            Your highest spending category (
            {dataWithPercentages[0]?.name || "N/A"}) represents{" "}
            {dataWithPercentages[0]?.percentage || "0"}% of your total expenses.
            {dataWithPercentages[0]?.percentage &&
            parseFloat(dataWithPercentages[0].percentage) > 30
              ? " Consider balancing your budget to reduce this category."
              : " Your spending seems well distributed across categories."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategoryChart;
