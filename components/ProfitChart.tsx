import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  balance: number;
}

interface ProfitChartProps {
  data: DataPoint[];
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl h-[300px]">
      <div className="mb-4">
        <h3 className="font-semibold text-white">Portfolio Performance</h3>
        <p className="text-xs text-slate-400">Projected Equity Curve (Simulated)</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#10b981' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};