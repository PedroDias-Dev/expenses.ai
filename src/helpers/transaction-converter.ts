import { promises as fs } from "fs";
import Papa from "papaparse";
import path from "path";

interface Transaction {
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
}

export async function processTransactionsFile(
  monthAndYear: string
): Promise<Transaction[]> {
  try {
    // Read the CSV file
    const csvData = await fs.readFile(
      path.resolve(
        process.cwd(),
        `./src/helpers/fatura-inter-${monthAndYear}.csv`
      ),
      "utf-8"
    );

    // Parse CSV
    const parsedData = Papa.parse<string[]>(csvData, {
      delimiter: ",",
      quoteChar: '"',
      skipEmptyLines: true,
    });

    const rows = parsedData.data;

    // Skip header row
    const transactions: Transaction[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip rows that don't have enough data
      if (row.length < 5) continue;

      // Remove the currency symbol (R$ ) and convert to number
      const valueString = row[4].replace("R$ ", "").replace(",", ".");
      console.log(valueString);
      const value = parseFloat(valueString);

      transactions.push({
        date: row[0],
        description: row[1],
        category: row[2],
        type: row[3],
        value: value,
      });
    }

    console.log(transactions);

    return transactions;
  } catch (error) {
    console.error("Error processing transactions file:", error);
    throw error;
  }
}
