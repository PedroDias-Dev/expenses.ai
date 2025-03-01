// Define Transaction type
interface Transaction {
  value: number;
  category: string;
  description: string;
  date: string;
}

// Define TransactionsByPeriod type
interface TransactionsByPeriod {
  [period: string]: Transaction[];
}

// Define PeriodSummary type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PeriodSummary {
  period: string;
  formattedPeriod?: string;
  available: boolean;
  totalSpent?: number;
  transactionCount?: number;
  averageTransactionValue?: number;
  topCategories?: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  largestTransaction?: {
    amount: number;
    category?: string;
  };
  smallestTransaction?: {
    amount: number;
    category?: string;
  };
}

const Summary = ({
  transactions,
  selectedPeriods,
}: {
  transactions: TransactionsByPeriod;
  selectedPeriods: string[];
}) => {
  /**
   * Summarizes transaction data into an object with essential information for AI analysis
   * @param {TransactionsByPeriod} transactions - The transactions grouped by period
   * @param {string[]} selectedPeriods - Array of period keys to include in the summary
   * @returns {Object} Summary object with essential financial information
   */
  const summarizeTransactionData = (
    transactions: TransactionsByPeriod,
    selectedPeriods: string[]
  ) => {
    // Return early if no data
    if (!transactions || !selectedPeriods || selectedPeriods.length === 0) {
      return {
        success: false,
        message: "No transaction data or periods selected",
      };
    }

    try {
      // Get all transactions from selected periods
      const allTransactions = selectedPeriods.reduce<Transaction[]>(
        (acc, period) => {
          if (transactions[period]) {
            return [...acc, ...transactions[period]];
          }
          return acc;
        },
        []
      );

      // Generate period-specific summaries
      const periodSummaries = selectedPeriods.map((period) => {
        const periodTransactions = transactions[period] || [];

        // Skip if no transactions
        if (periodTransactions.length === 0) {
          return {
            period,
            available: false,
          };
        }

        // Calculate total spent
        const total = periodTransactions.reduce((sum, t) => sum + t.value, 0);

        // Group by category
        const categorySums: Record<string, number> = periodTransactions.reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.value;
            return acc;
          },
          {} as Record<string, number>
        );

        // Sort categories by value
        const topCategories = Object.entries(categorySums)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([category, amount]) => ({
            category,
            amount: parseFloat(amount.toFixed(2)),
            percentage: parseFloat(((amount / total) * 100).toFixed(1)),
          }));

        // Format period (e.g. "2023-01" to "January 2023")
        const [year, month] = period.split("-");
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const formattedPeriod = `${months[parseInt(month) - 1]} ${year}`;

        return {
          period,
          formattedPeriod,
          available: true,
          totalSpent: parseFloat(total.toFixed(2)),
          transactionCount: periodTransactions.length,
          averageTransactionValue: parseFloat(
            (total / periodTransactions.length).toFixed(2)
          ),
          topCategories,
          largestTransaction: {
            amount: parseFloat(
              Math.max(...periodTransactions.map((t) => t.value)).toFixed(2)
            ),
            category: periodTransactions.find(
              (t) =>
                t.value === Math.max(...periodTransactions.map((t) => t.value))
            )?.category,
          },
          smallestTransaction: {
            amount: parseFloat(
              Math.min(...periodTransactions.map((t) => t.value)).toFixed(2)
            ),
            category: periodTransactions.find(
              (t) =>
                t.value === Math.min(...periodTransactions.map((t) => t.value))
            )?.category,
          },
        };
      });

      // Uber specific analysis
      const uberTransactions = allTransactions.filter(
        (t) =>
          t.description.toLowerCase().includes("uber") ||
          t.category.toLowerCase().includes("uber") ||
          t.category.toLowerCase().includes("ride") ||
          t.category.toLowerCase().includes("transport")
      );

      let uberSummary = null;
      if (uberTransactions.length > 0) {
        const uberTotal = uberTransactions.reduce((sum, t) => sum + t.value, 0);

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

        // Find most common time
        const mostCommonTime = Object.entries(timeOfDayCount).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        // Weekday vs weekend
        const weekdayTrips = uberTransactions.filter((t) => {
          const date = new Date(t.date);
          const day = date.getDay();
          return day > 0 && day < 6; // Monday(1) to Friday(5)
        }).length;

        uberSummary = {
          totalSpent: parseFloat(uberTotal.toFixed(2)),
          tripCount: uberTransactions.length,
          averageTripCost: parseFloat(
            (uberTotal / uberTransactions.length).toFixed(2)
          ),
          mostCommonTime,
          weekdayTrips,
          weekendTrips: uberTransactions.length - weekdayTrips,
          percentOfTotalSpending: parseFloat(
            (
              (uberTotal /
                allTransactions.reduce((sum, t) => sum + t.value, 0)) *
              100
            ).toFixed(1)
          ),
        };
      }

      // Overall summary calculations
      const totalSpent = allTransactions.reduce((sum, t) => sum + t.value, 0);

      // Category analysis
      const categoryTotals: Record<string, number> = allTransactions.reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.value;
          return acc;
        },
        {} as Record<string, number>
      );

      const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({
          category,
          amount: parseFloat(amount.toFixed(2)),
          percentage: parseFloat(((amount / totalSpent) * 100).toFixed(1)),
        }));

      // Period over period growth
      let periodOverPeriodGrowth = null;
      if (
        periodSummaries.length >= 2 &&
        periodSummaries[periodSummaries.length - 1].available &&
        periodSummaries[periodSummaries.length - 2].available
      ) {
        const currentPeriod = periodSummaries[periodSummaries.length - 1];
        const previousPeriod = periodSummaries[periodSummaries.length - 2];

        if (
          currentPeriod.totalSpent !== undefined &&
          previousPeriod.totalSpent !== undefined
        ) {
          const difference =
            currentPeriod.totalSpent - previousPeriod.totalSpent;
          const percentChange = (difference / previousPeriod.totalSpent) * 100;

          periodOverPeriodGrowth = {
            currentPeriod: currentPeriod.formattedPeriod,
            previousPeriod: previousPeriod.formattedPeriod,
            difference: parseFloat(difference.toFixed(2)),
            percentChange: parseFloat(percentChange.toFixed(1)),
            increased: difference > 0,
          };
        }
      }

      // Return comprehensive summary
      return {
        success: true,
        overview: {
          periodsAnalyzed: selectedPeriods.length,
          dateRange: {
            start: periodSummaries[0]?.formattedPeriod,
            end: periodSummaries[periodSummaries.length - 1]?.formattedPeriod,
          },
          totalSpent: parseFloat(totalSpent.toFixed(2)),
          totalTransactions: allTransactions.length,
          averageTransactionValue: parseFloat(
            (totalSpent / allTransactions.length).toFixed(2)
          ),
          topCategories,
          uberSummary,
          periodOverPeriodGrowth,
        },
        periodSummaries: periodSummaries.filter((p) => p.available),
        rawDataSample: {
          transactionCount: allTransactions.length,
          sampleTransactions: allTransactions.slice(0, 3),
        },
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: "Error processing transaction data",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const generateAISummary = () => {
    const summary = summarizeTransactionData(transactions, selectedPeriods);

    // You can now send this summary to an AI model
    console.log("Data ready for AI analysis:", summary);

    // Example: Send to API
    // fetch('your-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(summary)
    // });
  };

  return (
    <div>
      <button
        onClick={generateAISummary}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate AI Summary
      </button>
    </div>
  );
};

export default Summary;
