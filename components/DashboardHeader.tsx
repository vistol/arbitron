import React from 'react';
import { Bot, ShieldCheck, HelpCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '../services/marketData';

interface DashboardHeaderProps {
  onOpenHelp: () => void;
  onConnectWallet: () => void;
  onOpenDeposit: () => void; // Kept interface for compatibility but unused
  walletAddress: string | null;
  walletBalance: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
    onOpenHelp, 
    onConnectWallet, 
    walletAddress, 
    walletBalance 
}) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ArbBot<span className="text-emerald-400">.ai</span></h1>
            <p className="text-xs text-slate-400">Delta Neutral Strategy Engine</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Status: <span className="text-emerald-400 font-medium">Online</span></span>
            </div>
            
            <button 
              onClick={onOpenHelp}
              className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700 rounded-full"
              title="Documentation"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {walletAddress ? (
                <div className="flex items-center gap-2 bg-slate-900 p-1 pr-4 rounded-lg border border-slate-700">
                    <div className="px-3 py-1.5 bg-slate-800 rounded-md text-emerald-400 font-mono text-sm font-bold">
                        {formatCurrency(walletBalance)}
                    </div>
                    <div className="flex flex-col text-right mr-2">
                        <span className="text-[10px] text-slate-500 font-mono">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
                        <span className="text-[10px] text-slate-400">Arbitrum One</span>
                    </div>
                </div>
            ) : (
                <button 
                onClick={onConnectWallet}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </button>
            )}
        </div>
      </div>
    </header>
  );
};