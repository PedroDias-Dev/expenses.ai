import React from "react";
import { processTransactionsFile } from "@/helpers/transaction-converter";
import TransactionDashboard from "./_components/comparisons";

const ExpenseAnalysisDashboard = async () => {
  const periods = ["2024-12", "2025-01", "2025-02"];

  const transactions = await periods.reduce(async (accPromise, period) => {
    const acc = await accPromise;
    const periodTransactions = await processTransactionsFile(period);
    return {
      ...acc,
      [period]: periodTransactions,
    };
  }, Promise.resolve({}));

  return (
    <div className="p-4 max-w-6xl mx-auto text-black">
      <TransactionDashboard transactions={transactions} />
    </div>
  );
};

export default ExpenseAnalysisDashboard;
