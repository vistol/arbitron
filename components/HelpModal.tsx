import React from 'react';
import { X, ExternalLink, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex justify-between items-center">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                <Zap className="w-5 h-5" />
                </span>
                Quick Start Guide
            </h2>
            <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-700/30 hover:bg-slate-700 rounded-full p-2 transition-colors"
            >
            <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">1</div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base mb-1">What is this app?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                This is a dashboard for <strong>Funding Rate Arbitrage</strong>. It identifies crypto pairs where the Futures Funding Rate is high. The strategy involves buying the coin (Spot) and selling it (Futures) to earn the fee without taking price risk (Delta Neutral).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
             <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">2</div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base mb-1">How do I use it?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click <strong>Start Auto-Trade</strong> to simulate the bot entering positions automatically when opportunities arise. Watch the "Live Execution Logs" to see the bot in action.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
             <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">3</div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Where do the links go?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                In the <strong>Funding Opportunities</strong> table, clicking the <ExternalLink className="w-3 h-3 inline mx-1 text-slate-300" /> icon next to a pair will open the <strong>real trading page</strong> (e.g., Binance Futures) in a new tab. This allows you to verify the rates or trade manually.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
            >
              I understand, let's trade
            </button>
        </div>
      </div>
    </div>
  );
};