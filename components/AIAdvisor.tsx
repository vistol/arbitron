import React from 'react';
import { AIAnalysis } from '../types';
import { BrainCircuit, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AIAdvisorProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl animate-pulse h-full flex flex-col justify-center items-center">
        <BrainCircuit className="w-10 h-10 text-slate-600 mb-3 animate-spin" />
        <p className="text-slate-400 text-sm">Gemini is analyzing market sentiment...</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-xl h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit className="w-32 h-32 text-indigo-400" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                Gemini Strategy Insight
            </h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                analysis.riskScore < 30 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                analysis.riskScore < 70 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
                Risk Score: {analysis.riskScore}/100
            </div>
        </div>

        <div className="mb-4">
            <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1">Recommendation</p>
            <p className="text-white text-lg font-medium leading-relaxed">
                {analysis.recommendation}
            </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-indigo-500/20">
             <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Reasoning
             </p>
             <p className="text-slate-300 text-sm italic">
                "{analysis.reasoning}"
             </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
                analysis.sentiment === 'Bullish' ? 'bg-emerald-500' :
                analysis.sentiment === 'Bearish' ? 'bg-rose-500' : 'bg-slate-400'
            }`}></div>
            <span className="text-sm text-slate-400">Market Sentiment: <span className="text-white font-medium">{analysis.sentiment}</span></span>
        </div>
      </div>
    </div>
  );
};