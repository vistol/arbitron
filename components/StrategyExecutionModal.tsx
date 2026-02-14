import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, BookOpen, Lock, Wallet, ShieldCheck, FileCheck, Loader2 } from 'lucide-react';
import { MarketPair } from '../types';
import { formatCurrency } from '../services/marketData';

interface StrategyExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: MarketPair | null;
  initialAmount: number;
  walletBalance: number;
  onConfirm: (amount: number) => void;
  isWalletConnected: boolean;
  onRequestConnect: () => void;
}

export const StrategyExecutionModal: React.FC<StrategyExecutionModalProps> = ({ 
  isOpen, onClose, pair, initialAmount, walletBalance, onConfirm, isWalletConnected, onRequestConnect 
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1:Info, 2:Config, 3:Transact, 4:Success
  const [depositAmount, setDepositAmount] = useState(initialAmount);
  
  // Transaction States
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setIsApproved(false);
        setIsApproving(false);
        setIsDepositing(false);
        setDepositAmount(initialAmount);
    }
  }, [isOpen, initialAmount]);

  if (!isOpen || !pair) return null;

  const handleApprove = () => {
    setIsApproving(true);
    // Real App: await tokenContract.approve(vaultAddress, amount)
    setTimeout(() => {
        setIsApproving(false);
        setIsApproved(true);
    }, 2000);
  };

  const handleDeposit = () => {
    setIsDepositing(true);
    // Real App: await vaultContract.deposit(amount)
    setTimeout(() => {
        setIsDepositing(false);
        setStep(4);
        onConfirm(depositAmount);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">
                {step === 1 && "Vault Strategy"}
                {step === 2 && "Configure Deposit"}
                {step === 3 && "Confirm Transaction"}
                {step === 4 && "Transaction Submitted"}
            </h2>
            <p className="text-xs text-slate-400">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            
            {/* Step 1: Education */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg h-fit">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Delta Neutral Vault</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                You are about to deposit funds into the {pair.exchange} High-Yield Vault. 
                                <br/>
                                <br/>
                                <strong>Contract Address:</strong> <span className="font-mono text-slate-500 bg-slate-900 px-1 rounded">0x8B...39c2</span>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                                    <li>Automated Spot Buy + Futures Short Hedge.</li>
                                    <li>Funding fees auto-compounded daily.</li>
                                    <li>Withdraw liquidity at any time.</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                            Next: Configure Amount <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-slate-400">Deposit Amount (USDT)</label>
                                <span className="text-xs text-slate-400">Wallet Balance: <span className="text-emerald-400 font-mono">{formatCurrency(walletBalance)}</span></span>
                            </div>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-lg"
                                />
                                <button 
                                    onClick={() => setDepositAmount(walletBalance)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-700 hover:bg-slate-600 text-emerald-400 px-2 py-1 rounded"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <span className="block text-xs text-slate-500 mb-1">Target Pair</span>
                                <span className="block text-white font-bold">{pair.symbol}</span>
                             </div>
                             <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <span className="block text-xs text-slate-500 mb-1">Network</span>
                                <span className="block text-blue-400 font-bold font-mono">Arbitrum One</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                         <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-2">Back</button>
                         {isWalletConnected ? (
                            <button 
                                onClick={() => setStep(3)} 
                                disabled={depositAmount <= 0 || depositAmount > walletBalance}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                Proceed to Deposit <ArrowRight className="w-4 h-4" />
                            </button>
                         ) : (
                             <button onClick={onRequestConnect} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                                Connect Wallet <Wallet className="w-4 h-4" />
                            </button>
                         )}
                    </div>
                </div>
            )}

            {/* Step 3: Transaction Execution */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-slate-400">Interaction</span>
                            <span className="font-mono text-slate-500 text-xs">Smart Contract Call</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Total Deposit</span>
                            <span className="font-mono text-white font-bold">{formatCurrency(depositAmount)}</span>
                        </div>
                    </div>

                    {/* Step 3a: Approve */}
                    <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${isApproved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isApproved ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {isApproved ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <div>
                                <h4 className={`font-semibold ${isApproved ? 'text-emerald-400' : 'text-white'}`}>Approve Spending</h4>
                                <p className="text-xs text-slate-400">Allow vault to access {depositAmount} USDT.</p>
                            </div>
                        </div>
                        {!isApproved && (
                            <button 
                                onClick={handleApprove}
                                disabled={isApproving}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[100px]"
                            >
                                {isApproving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign'}
                            </button>
                        )}
                    </div>

                    {/* Step 3b: Deposit */}
                    <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${!isApproved ? 'opacity-50' : 'opacity-100'} ${step === 4 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 4 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Confirm Deposit</h4>
                                <p className="text-xs text-slate-400">Submit transaction to blockchain.</p>
                            </div>
                        </div>
                        {isApproved && (
                             <button 
                                onClick={handleDeposit}
                                disabled={isDepositing}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[100px]"
                             >
                                {isDepositing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit'}
                             </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <div className="text-center py-8">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 animate-bounce-slow">
                        <ShieldCheck className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Transaction Submitted!</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Your deposit of {formatCurrency(depositAmount)} is being processed by the Arbitrum network.
                    </p>
                    <div className="bg-slate-900 rounded-lg p-4 inline-block text-left w-full max-w-sm border border-slate-700">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">Hash</span>
                            <span className="text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                                0x7f2...9a12 <ExternalLinkIcon className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1"><FileCheck className="w-3 h-3" /> Success</span>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        {step === 4 && (
            <div className="p-6 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex justify-center">
                 <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-medium transition-colors w-full">
                    Close & View Dashboard
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};

const ExternalLinkIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);