import React from 'react';
import { DollarSign, Percent, Activity, Layers, Wallet, Lock } from 'lucide-react';
import { PortfolioStats } from '../types';
import { formatCurrency } from '../services/marketData';

interface StatsCardsProps {
  stats: PortfolioStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    { 
      label: 'Wallet Balance (Idle)', 
      value: formatCurrency(stats.walletBalance), 
      icon: Wallet, 
      color: 'text-slate-400', 
      bg: 'bg-slate-500/10' 
    },
    { 
      label: 'Active Investment', 
      value: formatCurrency(stats.investedBalance), 
      icon: Lock, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      label: 'Est. Daily Profit', 
      value: formatCurrency(stats.dailyProfit), 
      icon: TrendingIcon, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Current APY', 
      value: `${stats.apy.toFixed(2)}%`, 
      icon: Percent, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-white">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          {/* Decorative background element */}
          <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${card.bg} opacity-20 blur-2xl pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
};

const TrendingIcon = ({ className }: { className?: string }) => (
    <Activity className={className} />
);