
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCachedData, syncMarketData } from './services/geminiService';
import { CurrencyRate, MarketAnalysis, ChartData } from './types';
import RateCard from './components/RateCard';
import Converter from './components/Converter';
import AdBanner from './components/AdBanner';

type TabType = 'home' | 'calc' | 'charts' | 'lab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [data, setData] = useState(getCachedData());
  const [refreshing, setRefreshing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'syncing' | 'offline'>('online');

  useEffect(() => {
    const init = async () => {
      setDbStatus('syncing');
      const fresh = await syncMarketData();
      setData(fresh);
      setDbStatus('online');
    };
    init();
  }, []);

  const handleManualRefresh = async () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setRefreshing(true);
    setDbStatus('syncing');
    const fresh = await syncMarketData();
    setData(fresh);
    setRefreshing(false);
    setDbStatus('online');
  };

  const historicalData: ChartData[] = [
    { date: 'الأحد', price: 1510 }, { date: 'الاثنين', price: 1522 }, { date: 'الثلاثاء', price: 1515 },
    { date: 'الأربعاء', price: 1532 }, { date: 'الخميس', price: 1525 }, { date: 'الجمعة', price: 1528 },
    { date: 'السبت', price: 1530 },
  ];

  return (
    <div className="app-container bg-[#020617] min-h-screen text-slate-100 font-sans">
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20">ع</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight">دينار كاش</span>
              <div className="flex items-center gap-1">
                 <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Live Engine: {dbStatus}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Developer</span>
                <span className="text-[10px] font-black text-emerald-500">M. ALYASAR</span>
             </div>
             <button 
                onClick={handleManualRefresh}
                className={`w-11 h-11 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all ${refreshing ? 'animate-spin opacity-50' : ''}`}
              >
                <span className="text-xl">🔄</span>
              </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-28">
        {activeTab === 'home' && (
          <div className="space-y-6 pb-32 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 gap-5">
              {data.rates.map(rate => <RateCard key={rate.code} rate={rate} />)}
              
              <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2.5rem] p-7 border border-emerald-500/10">
                <h3 className="text-[10px] font-black text-emerald-500 mb-3 flex items-center gap-2">
                  <span>💎</span> رؤية Mohammed Alyasar الذكية
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                  {data.analysis.summary}
                </p>
              </div>
            </div>

            <div className="mt-8 text-center pb-4">
              <p className="text-[8px] font-black tracking-[0.4em] text-slate-600 uppercase mb-1">Created & Maintained By</p>
              <p className="text-sm font-black text-emerald-500 tracking-tighter">Mohammed Alyasar</p>
            </div>
          </div>
        )}

        {activeTab === 'calc' && (
          <div className="pb-32 animate-in slide-in-from-left-4 duration-500">
            <Converter rates={data.rates} />
            <div className="mt-8 text-center opacity-30">
               <p className="text-[9px] font-black text-slate-500 uppercase">Secure Supabase Infrastructure</p>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-5 pb-32 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-sm font-black mb-8 flex items-center gap-2"><span>📈</span> مؤشر السوق العراقي</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fill="url(#chartColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="pb-32 animate-in fade-in duration-500">
             <div className="bg-emerald-600 rounded-[3rem] p-10 text-slate-950 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                
                <div className="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl text-emerald-500 border-4 border-emerald-500/20">ع</div>
                
                <h2 className="text-3xl font-black mb-1">Mohammed Alyasar</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">Full-Stack AI Developer</p>
                
                <div className="flex justify-center gap-4 mb-10">
                   <a href="https://www.linkedin.com/in/mohammed-alyasar99/" target="_blank" className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-xl shadow-xl active:scale-90 transition-all border border-white/5">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                   </a>
                   <a href="https://github.com/mohammed99q" target="_blank" className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-xl shadow-xl active:scale-90 transition-all border border-white/5">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   </a>
                </div>
                
                <p className="text-xs font-bold opacity-90 mb-8 leading-relaxed px-4">
                  "دينار كاش" هو تطبيق يمثل الرؤية التكنولوجية لمستقبل مراقبة المال في العراق. تم الربط بنجاح مع قاعدة بيانات Supabase لضمان دقة واستمرارية البيانات.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-slate-950/20 py-4 rounded-3xl border border-white/10 text-[9px] font-black uppercase text-slate-900 flex items-center justify-center gap-2">
                     <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                     Supabase Infrastructure Active
                  </div>
                  <button className="w-full bg-slate-950 text-white py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
                    تحميل تطبيق محمد اليسار
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-950/10 text-[8px] font-black opacity-40 uppercase tracking-[0.5em]">
                  M. Alyasar Architecture © 2025
                </div>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bottom-nav z-[100] safe-pb">
        <div className="flex justify-around items-center h-22 px-4">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="الرئيسية" />
          <NavButton active={activeTab === 'calc'} onClick={() => setActiveTab('calc')} icon="⚖️" label="المحول" />
          <NavButton active={activeTab === 'charts'} onClick={() => setActiveTab('charts')} icon="📊" label="المؤشر" />
          <NavButton active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon="👤" label="المطور" />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all flex-1 py-4 ${active ? 'scale-110' : 'opacity-25 grayscale'}`}>
    <span className="text-2xl">{icon}</span>
    <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-emerald-500' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default App;
