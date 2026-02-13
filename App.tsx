
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
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // التحقق من وضع التثبيت (لإخفاء رابط الموقع)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone;
    setIsStandalone(checkStandalone);

    // تحديث صامت عند الفتح
    const init = async () => {
      const fresh = await syncMarketData();
      setData(fresh);
    };
    init();
  }, []);

  const handleManualRefresh = async () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setRefreshing(true);
    const fresh = await syncMarketData();
    setData(fresh);
    setRefreshing(false);
  };

  const historicalData: ChartData[] = [
    { date: 'الأحد', price: 1510 }, { date: 'الاثنين', price: 1522 }, { date: 'الثلاثاء', price: 1515 },
    { date: 'الأربعاء', price: 1532 }, { date: 'الخميس', price: 1525 }, { date: 'الجمعة', price: 1528 },
    { date: 'السبت', price: 1530 },
  ];

  return (
    <div className="app-container bg-[#020617] min-h-screen text-slate-100 font-sans">
      {/* شريط تنبيه التثبيت - يظهر فقط لمستخدمي المتصفح */}
      {!isStandalone && (
        <div className="fixed top-0 inset-x-0 z-[200] bg-amber-500 text-slate-900 py-2 px-4 text-[10px] font-black flex justify-between items-center shadow-2xl">
          <span>📲 ثبت التطبيق على هاتفك لإخفاء رابط الموقع</span>
          <span className="bg-slate-900 text-white px-2 py-0.5 rounded">إضافة للشاشة</span>
        </div>
      )}

      <header className={`fixed inset-x-0 z-[100] transition-all duration-500 bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 ${!isStandalone ? 'top-8' : 'top-0 pt-[env(safe-area-inset-top)]'}`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">ع</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight">دينار كاش</span>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> مباشر الآن
              </span>
            </div>
          </div>
          <button 
            onClick={handleManualRefresh}
            className={`w-11 h-11 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all ${refreshing ? 'animate-spin opacity-50' : ''}`}
          >
            <span className="text-xl">🔄</span>
          </button>
        </div>
      </header>

      <main className={`px-4 transition-all duration-500 ${!isStandalone ? 'pt-32' : 'pt-24'}`}>
        {activeTab === 'home' && (
          <div className="space-y-6 pb-32 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center px-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">بورصة بغداد الرئيسية</span>
               <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                 تحديث: {data.analysis.lastUpdated}
               </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {data.rates.map(rate => <RateCard key={rate.code} rate={rate} />)}
              
              <div className="bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] p-7 border border-white/5">
                <h3 className="text-[10px] font-black text-amber-500 mb-3 flex items-center gap-2">
                  <span>✨</span> تحليل الذكاء الاصطناعي
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                  {data.analysis.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calc' && (
          <div className="pb-32 animate-in slide-in-from-left-4 duration-500">
            <Converter rates={data.rates} />
            <AdBanner label="إعلان" />
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-5 pb-32 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-sm font-black mb-8 flex items-center gap-2"><span>📈</span> الرسم البياني الأسبوعي</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} fill="url(#chartColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="pb-32 animate-in fade-in duration-500">
             <div className="bg-amber-500 rounded-[3rem] p-12 text-slate-950 text-center shadow-2xl">
                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">ع</div>
                <h2 className="text-2xl font-black mb-4">APK & Store</h2>
                <p className="text-xs font-bold opacity-80 mb-8 leading-relaxed">
                  هذا التطبيق مصمم ليعمل كـ APK حقيقي. قم بالضغط على "إضافة للشاشة الرئيسية" من خيارات المتصفح ليعمل التطبيق بملء الشاشة بدون روابط.
                </p>
                <button className="bg-slate-950 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  دليل التحميل والرفع
                </button>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bottom-nav z-[100] safe-pb">
        <div className="flex justify-around items-center h-22 px-4">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="الرئيسية" />
          <NavButton active={activeTab === 'calc'} onClick={() => setActiveTab('calc')} icon="⚖️" label="المحول" />
          <NavButton active={activeTab === 'charts'} onClick={() => setActiveTab('charts')} icon="📈" label="المؤشر" />
          <NavButton active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon="📦" label="المتجر" />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all flex-1 py-4 ${active ? 'scale-110' : 'opacity-25 grayscale'}`}>
    <span className="text-2xl">{icon}</span>
    <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-amber-500' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default App;
