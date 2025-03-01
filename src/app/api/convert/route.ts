import { processTransactionsFile } from "@/helpers/transaction-converter";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const csvFilePath = path.join(process.cwd(), "data", "transactions.csv");
    const transactions = await processTransactionsFile(csvFilePath);

    res.status(200).json(transactions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    res.status(500).json({ error: "Failed to process transactions" });
  }
}
