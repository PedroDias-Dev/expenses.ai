export interface CategorySums {
  [category: string]: number;
}

export interface PeriodSummary {
  period: string;
  formattedPeriod: string;
  total: number;
  categorySums: CategorySums;
  count: number;
  avgTransaction: number;
}

export interface ChartDataItem {
  [key: string]: string | number;
}

export interface PieChartDataItem {
  name: string;
  value: number;
}
