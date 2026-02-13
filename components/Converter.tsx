
import React, { useState } from 'react';
import { CurrencyRate } from '../types';

interface ConverterProps {
  rates: CurrencyRate[];
}

const Converter: React.FC<ConverterProps> = ({ rates }) => {
  const [amount, setAmount] = useState<number>(100);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isIqdSource, setIsIqdSource] = useState<boolean>(false);

  const currentRate = rates.find(r => r.code === selectedCurrency);
  const rateValue = currentRate?.parallelRate || currentRate?.officialRate || 1;

  const result = isIqdSource ? amount / rateValue : amount * rateValue;

  return (
    <div className="relative overflow-hidden bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/20">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">⚡</div>
          <h2 className="text-xl font-bold">المحول الذكي</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mr-2">المبلغ المراد تحويله</label>
            <div className="group bg-white/5 border border-white/10 rounded-2xl p-1 transition-all focus-within:border-blue-500/50 focus-within:bg-white/10">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent px-4 py-4 text-white focus:outline-none text-2xl font-black"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-center -my-2 relative">
            <button 
              onClick={() => setIsIqdSource(!isIqdSource)}
              className="bg-blue-600 text-white w-12 h-12 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-blue-600/40 z-20 flex items-center justify-center border-4 border-[#0f172a]"
            >
              <span className="text-xl">⇵</span>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">النتيجة التقريبية</label>
              <select 
                className="bg-blue-600/20 text-blue-400 font-bold text-xs py-1 px-3 rounded-full border border-blue-500/30 focus:outline-none cursor-pointer hover:bg-blue-600/40"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {rates.map(r => (
                  <option key={r.code} value={r.code} className="text-slate-900">{r.code} - {r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400">
                {result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-sm font-bold text-slate-400">
                {isIqdSource ? currentRate?.code : 'دينار'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          بيانات محدثة بناءً على متوسط أسعار الصيرفة المحلية
        </div>
      </div>
    </div>
  );
};

export default Converter;
