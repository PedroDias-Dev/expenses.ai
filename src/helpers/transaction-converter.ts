import { Transaction } from "@/types/transaction";
import Papa from "papaparse";
import axios from "axios";

export async function processTransactionsFile(
  csvData: string
): Promise<Transaction[]> {
  try {
    console.log(csvData);

    // Determine if we're in production or development environment
    const isProduction = process.env.NODE_ENV === "production";

    // Choose the appropriate endpoint based on environment
    const endpoint = isProduction
      ? "https://transformcsvwithclaude-mevs47ppsa-uc.a.run.app"
      : "http://127.0.0.1:5001/expensesdotai/us-central1/transformCsvWithClaude";

    // Make request to Claude API endpoint
    const response = await axios.post(endpoint, {
      data: { csvText: csvData },
    });

    // Extract the transactions from the response
    const transactions = response.data.data;
    console.log(transactions);

    // // Parse CSV
    // const parsedData = Papa.parse<string[]>(csvData, {
    //   delimiter: ",",
    //   quoteChar: '"',
    //   skipEmptyLines: true,
    // });

    // const rows = parsedData.data;

    // // Skip header row
    // const transactions: Transaction[] = [];

    // for (let i = 1; i < rows.length; i++) {
    //   const row = rows[i];

    //   // Skip rows that don't have enough data
    //   if (row.length < 5) continue;

    //   // Remove the currency symbol (R$ ) and convert to number
    //   const valueString = row[4].replace("R$ ", "").replace(",", ".");
    //   console.log(valueString);
    //   const value = parseFloat(valueString);

    //   transactions.push({
    //     date: row[0],
    //     description: row[1],
    //     category: row[2],
    //     type: row[3],
    //     value: value,
    //   });
    // }

    return transactions;
  } catch (error) {
    console.error("Error processing transactions file:", error);
    throw error;
  }
}
