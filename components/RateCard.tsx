
import React from 'react';
import { CurrencyRate } from '../types';

interface RateCardProps {
  rate: CurrencyRate;
}

const RateCard: React.FC<RateCardProps> = ({ rate }) => {
  const isPositive = rate.change >= 0;

  return (
    <div className="group bg-white/5 rounded-[2.5rem] p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-2xl text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
            {rate.flag}
          </div>
          <div>
            <h3 className="font-black text-white text-xl tracking-tight">{rate.name}</h3>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.2em]">{rate.code}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {isPositive ? '+' : ''}{rate.change}%
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">السوق الموازي</span>
          <div className="text-right">
            <span className="text-3xl font-black text-amber-500">
              {rate.parallelRate?.toLocaleString() || rate.officialRate.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mr-2">د.ع</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-600 uppercase">البنك المركزي</span>
          <span className="text-sm font-bold text-slate-400">
            {rate.officialRate.toLocaleString()} <span className="text-[10px] opacity-50">د.ع</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
