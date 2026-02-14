import React, { useState, useEffect } from 'react';
import { MarketPair } from '../types';
import { Calculator, DollarSign, ArrowRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '../services/marketData';

interface ProfitCalculatorProps {
  pairs: MarketPair[];
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ pairs }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  
  // Default to the highest yielding pair when pairs load
  useEffect(() => {
    if (pairs.length > 0 && !selectedSymbol) {
      setSelectedSymbol(pairs[0].symbol);
    }
  }, [pairs, selectedSymbol]);

  const selectedPair = pairs.find(p => p.symbol === selectedSymbol) || pairs[0];
  
  if (!selectedPair) return null;

  // Calculations
  // Funding is typically paid every 8 hours (3 times a day)
  const ratePerInterval = Math.abs(selectedPair.fundingRate) / 100; // Convert % to decimal
  const dailyRate = ratePerInterval * 3;
  const dailyProfit = amount * dailyRate;
  const monthlyProfit = dailyProfit * 30;
  const yearlyProfit = dailyProfit * 365;
  
  // Estimation of trading fees (Spot + Futures Entry & Exit)
  // Approx 0.1% per leg * 4 legs (Spot Buy/Sell, Fut Sell/Buy) ~= 0.4% worst case, optimizing to 0.2%
  const estFees = amount * 0.002; 
  const breakEvenHours = dailyProfit > 0 ? (estFees / (dailyProfit / 24)) : 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
        <div className="bg-blue-500/10 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold">Profit Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Input Amount */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Investment Amount (USDT)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Select Pair */}
        <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Target Opportunity</label>
            <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500 text-sm"
            >
                {pairs.map(pair => (
                    <option key={pair.symbol} value={pair.symbol}>
                        {pair.symbol} - Rate: {formatPercent(pair.fundingRate)}
                    </option>
                ))}
            </select>
        </div>

        {/* Results */}
        <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-700/50">
            <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Daily Return</span>
                <span className="text-emerald-400 font-bold font-mono">+{formatCurrency(dailyProfit)}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Monthly Projected</span>
                <span className="text-emerald-400 font-bold font-mono">+{formatCurrency(monthlyProfit)}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">APY</span>
                <span className="text-blue-400 font-bold font-mono">{(dailyRate * 365 * 100).toFixed(2)}%</span>
            </div>
            
            <div className="border-t border-slate-700/50 my-2 pt-2">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Est. Fees (Entry+Exit)</span>
                    <span className="text-rose-400">-{formatCurrency(estFees)}</span>
                </div>
                 <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-500">Break-even time</span>
                    <span className="text-slate-300">{breakEvenHours < 24 ? `${Math.ceil(breakEvenHours)} hours` : `${(breakEvenHours/24).toFixed(1)} days`}</span>
                </div>
            </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            Simulate Execution <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};