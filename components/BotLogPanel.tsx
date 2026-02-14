import React, { useRef, useEffect } from 'react';
import { BotLog } from '../types';
import { Terminal } from 'lucide-react';

interface BotLogPanelProps {
  logs: BotLog[];
}

export const BotLogPanel: React.FC<BotLogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-full min-h-[300px]">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Live Execution Logs
        </h3>
        <span className="text-xs text-emerald-400 animate-pulse">● System Active</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar">
        {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-10">Waiting for bot initialization...</div>
        ) : (
            logs.map((log) => (
            <div key={log.id} className="flex gap-3">
                <span className="text-slate-500 shrink-0">[{log.timestamp.toLocaleTimeString()}]</span>
                <span className={`break-all ${
                log.type === 'error' ? 'text-rose-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'success' ? 'text-emerald-400' :
                'text-slate-300'
                }`}>
                {log.message}
                </span>
            </div>
            ))
        )}
      </div>
    </div>
  );
};