export interface Transaction {
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
}

export interface TransactionsByPeriod {
  [period: string]: Transaction[];
}
