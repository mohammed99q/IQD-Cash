
export interface CurrencyRate {
  code: string;
  name: string;
  officialRate: number;
  parallelRate?: number;
  change: number;
  flag: string;
}

export interface MarketAnalysis {
  summary: string;
  sources: { title: string; uri: string }[];
  lastUpdated: string;
}

export interface ChartData {
  date: string;
  price: number;
}
