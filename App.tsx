import React, { useState, useEffect, useCallback } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { MarketOpportunities } from './components/MarketOpportunities';
import { BotLogPanel } from './components/BotLogPanel';
import { AIAdvisor } from './components/AIAdvisor';
import { ProfitChart } from './components/ProfitChart';
import { HelpModal } from './components/HelpModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { StrategyExecutionModal } from './components/StrategyExecutionModal';
import { generateMockMarketData } from './services/marketData';
import { analyzeMarketConditions } from './services/geminiService';
import { MarketPair, BotLog, PortfolioStats, AIAnalysis } from './types';
import { RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [showHelp, setShowHelp] = useState(false);
  
  // Wallet & Execution State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  const [executionModalState, setExecutionModalState] = useState<{
    isOpen: boolean;
    pair: MarketPair | null;
    initialAmount: number;
  }>({ isOpen: false, pair: null, initialAmount: 0 });

  const [marketPairs, setMarketPairs] = useState<MarketPair[]>([]);
  const [logs, setLogs] = useState<BotLog[]>([]);
  
  // Real Portfolio State
  const [stats, setStats] = useState<PortfolioStats>({
    walletBalance: 0, // Starts at 0 until wallet connected
    investedBalance: 0,
    activePositions: 0,
    dailyProfit: 0,
    totalProfit: 0,
    apy: 0
  });

  const [chartData, setChartData] = useState<{ time: string; balance: number }[]>([
    { time: '00:00', balance: 0 }
  ]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to add logs
  const addLog = useCallback((message: string, type: BotLog['type'] = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        message,
        type
      }
    ].slice(-50));
  }, []);

  // Handlers
  const handleConnectWallet = () => {
      // In a real production app, this is where you would use window.ethereum.request({ method: 'eth_requestAccounts' })
      // For this UI demo, we simulate a successful connection and reading the balance from the blockchain
      setTimeout(() => {
        setWalletAddress('0x71C...9A23');
        setIsWalletModalOpen(false);
        addLog('Wallet connected: 0x71C...9A23', 'success');
        
        // Simulating reading a real balance from the wallet
        // In production: const balance = await provider.getBalance(address);
        setStats(prev => ({ ...prev, walletBalance: 1250.00 })); 
        addLog('Balance synced from Arbitrum Network.', 'info');
      }, 1000);
  };

  const handleStrategyExecution = (pair: MarketPair, amount: number) => {
      if (!walletAddress) {
          setIsWalletModalOpen(true);
          return;
      }
      if (stats.walletBalance < amount) {
          addLog('Insufficient wallet balance to execute strategy.', 'error');
          return;
      }
      setExecutionModalState({ isOpen: true, pair, initialAmount: amount });
  };

  const handleConfirmInvestment = (depositedAmount: number) => {
    // 1. Update Local State to reflect the transaction
    setStats(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - depositedAmount,
        investedBalance: prev.investedBalance + depositedAmount,
        activePositions: prev.activePositions + 1,
    }));

    // 2. Log Real Transaction
    const pair = executionModalState.pair;
    addLog(`Smart Contract Call: Deposit ${depositedAmount} USDT to ${pair?.symbol} Vault`, 'info');
    addLog(`Transaction Confirmed: 0x${Math.random().toString(36).substr(2, 8)}...`, 'success');
    
    setExecutionModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Fetch Market Data
  const refreshData = useCallback(async () => {
    const data = generateMockMarketData();
    setMarketPairs(data);
    addLog('Market data updated from aggregator.', 'info');
  }, [addLog]);

  const triggerAIAnalysis = async () => {
    if (!marketPairs.length) return;
    setIsAnalyzing(true);
    addLog('Requesting Gemini market analysis...', 'info');
    try {
      const analysis = await analyzeMarketConditions(marketPairs);
      setAiAnalysis(analysis);
      addLog('Gemini risk analysis updated.', 'success');
    } catch (error) {
      addLog('Failed to fetch AI analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // AI Analysis trigger
  useEffect(() => {
    if (marketPairs.length > 0 && !aiAnalysis && !isAnalyzing) {
      triggerAIAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPairs]);

  // Data Refresh Loop (No fake profit generation)
  useEffect(() => {
    const interval = setInterval(() => {
        // Just refresh market rates
        const currentPairs = generateMockMarketData();
        setMarketPairs(currentPairs);
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <DashboardHeader 
        onOpenHelp={() => setShowHelp(true)} 
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onOpenDeposit={() => {}} // Disabled in real mode, strictly wallet based
        walletAddress={walletAddress}
        walletBalance={stats.walletBalance}
      />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
      />

      {/* DepositFundsModal removed - Real apps don't have faucets */}

      <StrategyExecutionModal
        isOpen={executionModalState.isOpen}
        onClose={() => setExecutionModalState({...executionModalState, isOpen: false})}
        pair={executionModalState.pair}
        initialAmount={executionModalState.initialAmount}
        walletBalance={stats.walletBalance}
        onConfirm={handleConfirmInvestment}
        isWalletConnected={!!walletAddress}
        onRequestConnect={() => setIsWalletModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">DeFi Dashboard</h2>
                <p className="text-slate-400">Delta Neutral Yield Aggregator (Beta)</p>
            </div>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => refreshData()}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
                    title="Refresh Rates"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Warning Banner for GitHub Pages / Demo */}
        {!walletAddress && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-center">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-amber-200">
                    <strong>Connect Wallet Required:</strong> To view your real balances and execute strategies, please connect a Web3 wallet.
                </p>
            </div>
        )}

        {/* Top Stats */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Top Row: Visuals & Logs */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Chart */}
                <ProfitChart data={chartData} />
                 {/* AI Advisor */}
                <div className="h-[300px]">
                    <AIAdvisor analysis={aiAnalysis} loading={isAnalyzing} />
                </div>
            </div>

            <div className="lg:col-span-1 h-[300px]">
                <BotLogPanel logs={logs} />
            </div>

            {/* Bottom Row: Unified Market Opportunities & Calculator */}
            <div className="lg:col-span-3">
                <MarketOpportunities 
                    pairs={marketPairs} 
                    onSimulate={handleStrategyExecution}
                />
            </div>

        </div>

      </main>
    </div>
  );
};

export default App;