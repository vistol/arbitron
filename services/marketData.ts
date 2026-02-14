import { MarketPair } from '../types';

const PAIRS = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT'];
const EXCHANGES = ['Binance', 'Bybit', 'OKX'];

export const generateMockMarketData = (): MarketPair[] => {
  const data: MarketPair[] = [];

  PAIRS.forEach(symbol => {
    // Simulate funding rate variations (usually around 0.01% per 8h, but sometimes spikes)
    const baseRate = 0.01;
    const spike = Math.random() > 0.8 ? (Math.random() * 0.05) : 0;
    const direction = Math.random() > 0.3 ? 1 : -1; // Mostly positive funding
    
    const fundingRate = (baseRate + spike) * direction;
    const price = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : Math.random() * 100 + 10;

    data.push({
      symbol: `${symbol}/USDT`,
      exchange: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)],
      fundingRate: parseFloat(fundingRate.toFixed(4)),
      nextFundingTime: '00:00:00', // Placeholder
      price: parseFloat(price.toFixed(2)),
      volatility24h: Math.floor(Math.random() * 100)
    });
  });

  return data.sort((a, b) => Math.abs(b.fundingRate) - Math.abs(a.fundingRate));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatPercent = (value: number) => {
  return `${(value).toFixed(4)}%`;
};