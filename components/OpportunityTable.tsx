import React from 'react';
import { MarketPair } from '../types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ExternalLink } from 'lucide-react';
import { formatPercent } from '../services/marketData';

interface OpportunityTableProps {
  pairs: MarketPair[];
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({ pairs }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Funding Opportunities
        </h3>
        <span className="text-xs text-slate-400">Auto-refresh: 5s</span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-700/30 text-slate-200 sticky top-0 backdrop-blur-md">
            <tr>
              <th className="p-4 font-medium">Pair</th>
              <th className="p-4 font-medium">Exchange</th>
              <th className="p-4 font-medium">Funding Rate</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {pairs.map((pair, index) => {
               // Construct a mock URL for Binance Futures (example)
               const symbolClean = pair.symbol.replace('/', '').toUpperCase(); 
               const exchangeUrl = `https://www.binance.com/en/futures/${symbolClean}`;

               return (
                <tr key={index} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="p-4 font-medium text-white flex items-center gap-2">
                    {pair.symbol}
                    <a 
                      href={exchangeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-opacity"
                      title="Open on Exchange"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                  <td className="p-4">{pair.exchange}</td>
                  <td className={`p-4 font-mono font-bold ${pair.fundingRate > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPercent(pair.fundingRate)}
                  </td>
                  <td className="p-4 text-right">
                      {pair.fundingRate > 0 ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                                <ArrowDownRight className="w-3 h-3" /> Short Perp / Long Spot
                            </span>
                          </div>
                      ) : (
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20">
                                <ArrowUpRight className="w-3 h-3" /> Long Perp / Short Spot
                            </span>
                          </div>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};