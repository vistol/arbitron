
export interface MarketPair {
  symbol: string;
  exchange: string;
  fundingRate: number; // Percentage (e.g., 0.01 for 0.01%)
  nextFundingTime: string;
  price: number;
  volatility24h: number; // Simulated volatility index 0-100
}

export interface BotLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface PortfolioStats {
  walletBalance: number; // Idle funds in connected wallet
  investedBalance: number; // Funds actively deployed
  activePositions: number;
  dailyProfit: number;
  totalProfit: number;
  apy: number;
}

export interface AIAnalysis {
  riskScore: number; // 0-100
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  recommendation: string;
  reasoning: string;
}
