import React from 'react';
import { X, Wallet, Shield } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  const wallets = [
    { name: 'MetaMask', color: 'bg-orange-500/10 text-orange-500', icon: '🦊' },
    { name: 'WalletConnect', color: 'bg-blue-500/10 text-blue-500', icon: '📡' },
    { name: 'Coinbase Wallet', color: 'bg-blue-600/10 text-blue-600', icon: '🔵' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            Connect Wallet
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm text-slate-400 mb-4">Select your wallet to sign the transaction and start earning yields.</p>
          
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={onConnect}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700 border border-transparent hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{wallet.icon}</span>
                <span className="font-medium text-slate-200 group-hover:text-white">{wallet.name}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${wallet.name === 'MetaMask' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-slate-900/30 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secured by Gemini AI Risk Engine
            </p>
        </div>
      </div>
    </div>
  );
};