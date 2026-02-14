import React, { useState, useEffect, useMemo } from 'react';
import { MarketPair } from '../types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ExternalLink, Calculator, DollarSign, ArrowRight, MousePointerClick, ArrowUp, ArrowDown } from 'lucide-react';
import { formatPercent, formatCurrency } from '../services/marketData';

interface MarketOpportunitiesProps {
  pairs: MarketPair[];
  onSimulate: (pair: MarketPair, amount: number) => void;
}

type SortKey = keyof MarketPair;

export const MarketOpportunities: React.FC<MarketOpportunitiesProps> = ({ pairs, onSimulate }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'fundingRate', direction: 'desc' });

  // Default to first pair
  useEffect(() => {
    if (pairs.length > 0 && !selectedSymbol) {
      setSelectedSymbol(pairs[0].symbol);
    }
  }, [pairs, selectedSymbol]);

  // Sorting Logic
  const sortedPairs = useMemo(() => {
    let sortableItems = [...pairs];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [pairs, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-30 inline-flex items-center justify-center">⇅</div>;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 inline-block text-emerald-400" /> 
      : <ArrowDown className="w-4 h-4 ml-1 inline-block text-emerald-400" />;
  };

  const selectedPair = pairs.find(p => p.symbol === selectedSymbol) || pairs[0];

  // Calculator Logic
  const ratePerInterval = selectedPair ? Math.abs(selectedPair.fundingRate) / 100 : 0;
  const dailyRate = ratePerInterval * 3;
  const dailyProfit = amount * dailyRate;
  const monthlyProfit = dailyProfit * 30;
  const estFees = amount * 0.002;
  const breakEvenHours = dailyProfit > 0 ? (estFees / (dailyProfit / 24)) : 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col lg:flex-row h-auto lg:h-[500px]">
      
      {/* Left Side: Opportunity Table */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-700">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Live Market Opportunities
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MousePointerClick className="w-3 h-3" /> Select a pair to calculate
          </span>
        </div>
        
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-700/30 text-slate-200 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th 
                  className="p-4 font-medium cursor-pointer hover:text-white transition-colors group select-none"
                  onClick={() => requestSort('symbol')}
                >
                  <div className="flex items-center">
                    Pair <SortIcon columnKey="symbol" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium hidden sm:table-cell cursor-pointer hover:text-white transition-colors group select-none"
                  onClick={() => requestSort('exchange')}
                >
                  <div className="flex items-center">
                    Exchange <SortIcon columnKey="exchange" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium cursor-pointer hover:text-white transition-colors group select-none"
                  onClick={() => requestSort('fundingRate')}
                >
                  <div className="flex items-center">
                    Rate (8h) <SortIcon columnKey="fundingRate" />
                  </div>
                </th>
                <th className="p-4 font-medium text-right">Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {sortedPairs.map((pair) => {
                 const isSelected = pair.symbol === selectedSymbol;
                 const symbolClean = pair.symbol.replace('/', '').toUpperCase(); 
                 const exchangeUrl = `https://www.binance.com/en/futures/${symbolClean}`;

                 return (
                  <tr 
                    key={pair.symbol} 
                    onClick={() => setSelectedSymbol(pair.symbol)}
                    className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'hover:bg-slate-700/20 border-l-2 border-transparent'
                    }`}
                  >
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      {pair.symbol}
                      <a 
                        href={exchangeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-600 hover:text-blue-400 transition-colors"
                        title="Open on Exchange"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4 hidden sm:table-cell">{pair.exchange}</td>
                    <td className={`p-4 font-mono font-bold ${pair.fundingRate > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(pair.fundingRate)}
                    </td>
                    <td className="p-4 text-right">
                        {pair.fundingRate > 0 ? (
                             <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                                <ArrowDownRight className="w-3 h-3" /> Short/Long
                            </span>
                        ) : (
                             <span className="inline-flex items-center gap-1 text-rose-400 text-xs">
                                <ArrowUpRight className="w-3 h-3" /> Long/Short
                            </span>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side: Calculator */}
      <div className="w-full lg:w-[350px] bg-slate-800/50 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-500/10 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Profit Calculator</h3>
            <p className="text-xs text-slate-400">Target: <span className="text-emerald-400 font-bold">{selectedSymbol}</span></p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          {/* Input */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Investment Amount (USDT)</label>
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-9 pr-4 text-white focus:outline-none focus:border-blue-500 font-mono text-lg transition-all"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border border-slate-700 shadow-inner space-y-4">
             <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Funding Rate (8h)</span>
                  <span className={`font-mono font-bold ${selectedPair?.fundingRate > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedPair ? formatPercent(selectedPair.fundingRate) : '0.00%'}
                  </span>
             </div>
             
             <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Daily Return</span>
                    <span className="text-white font-bold font-mono">+{formatCurrency(dailyProfit)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Monthly Projected</span>
                    <span className="text-emerald-400 font-bold font-mono text-lg">+{formatCurrency(monthlyProfit)}</span>
                </div>
             </div>

             <div className="pt-2 border-t border-slate-700/50">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">APY (Compounded)</span>
                    <span className="text-blue-400 font-bold font-mono">{(dailyRate * 365 * 100).toFixed(2)}%</span>
                </div>
             </div>
          </div>

          <div className="mt-auto">
             <div className="flex justify-between items-center text-xs text-slate-500 mb-4 px-1">
                <span>Fees Est: {formatCurrency(estFees)}</span>
                <span>Break-even: {breakEvenHours < 24 ? `${Math.ceil(breakEvenHours)}h` : `${(breakEvenHours/24).toFixed(1)}d`}</span>
            </div>
            <button 
                onClick={() => onSimulate(selectedPair, amount)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                Execute {selectedSymbol} Strategy <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};