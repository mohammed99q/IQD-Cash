
import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchIqdData, generateAppAssets } from './services/geminiService';
import { CurrencyRate, MarketAnalysis, ChartData } from './types';
import RateCard from './components/RateCard';
import Converter from './components/Converter';
import AdBanner from './components/AdBanner';

type TabType = 'home' | 'calc' | 'charts' | 'lab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const historicalData: ChartData[] = [
    { date: 'الأحد', price: 1510 }, { date: 'الاثنين', price: 1522 }, { date: 'الثلاثاء', price: 1515 },
    { date: 'الأربعاء', price: 1532 }, { date: 'الخميس', price: 1525 }, { date: 'الجمعة', price: 1528 },
    { date: 'السبت', price: 1530 },
  ];

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // إذا تغير الـ SW، نقوم بتحديث الصفحة لضمان تشغيل أحدث كود
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else {
      setRefreshing(true);
      triggerHaptic();
    }
    try {
      const data = await fetchIqdData();
      setRates(data.rates);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Data fetch failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="px-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {isOnline ? 'اتصال مباشر بالسوق' : 'وضع الأوفلاين - بيانات مخزنة'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md">تحديث: {analysis?.lastUpdated || '--:--'}</span>
            </div>

            <div className="grid grid-cols-1 gap-5 px-4 pb-28">
              {rates.length > 0 ? rates.map(rate => (
                <div key={rate.code} className={!isOnline ? 'opacity-70 grayscale-[0.3]' : ''}>
                  <RateCard rate={rate} />
                </div>
              )) : (
                <div className="p-10 text-center text-slate-600 font-bold text-sm">جاري تحميل أحدث الأسعار...</div>
              )}
              
              <div className="bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] p-6 border border-white/5 backdrop-blur-md">
                <h3 className="text-xs font-black text-amber-500 mb-3 flex items-center gap-2">
                  <span className="text-lg">✨</span> تحليل Gemini AI الذكي
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {analysis?.summary || 'يتم الآن تحليل تقلبات السوق العراقي بناءً على البيانات المتوفرة من البورصات المحلية...'}
                </p>
              </div>
            </div>
          </div>
        );
      case 'calc':
        return (
          <div className="px-4 py-4 animate-in slide-in-from-left-6 duration-500">
            <Converter rates={rates} />
            <AdBanner label="مساحة إعلانية" />
          </div>
        );
      case 'charts':
        return (
          <div className="px-4 py-4 animate-in slide-in-from-left-6 duration-500 space-y-4 pb-28">
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-base font-black mb-6 flex items-center gap-2">
                <span>📊</span> حركة الدولار (الأسبوع)
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '15px', fontSize: '11px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} />
                    <Area type="monotone" dataKey="price" stroke="#eab308" strokeWidth={3} fill="#eab308" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 px-4 uppercase tracking-[0.2em]">المراجع الموثوقة</p>
              <div className="grid grid-cols-1 gap-2 px-2">
                {analysis?.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" className="p-4 bg-white/5 rounded-2xl text-[10px] font-bold text-slate-400 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                    <span className="truncate flex-1">🌍 {s.title}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      case 'lab':
        return (
          <div className="px-4 py-4 animate-in slide-in-from-left-6 duration-500 space-y-6 pb-28">
             <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-10 text-slate-950 shadow-2xl shadow-amber-500/20">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🧪</div>
               <h2 className="text-2xl font-black mb-3">مختبر الهوية</h2>
               <p className="text-xs font-bold opacity-80 mb-8 leading-relaxed">بإمكانك تغيير مظهر التطبيق الخاص بك عبر توليد شعارات حصرية باستخدام Gemini Image Generation.</p>
               <button 
                  onClick={() => { triggerHaptic(); alert("قريباً: سيتم تفعيل ميزة التوليد المباشر في النسخة القادمة!"); }}
                  className="bg-slate-950 text-white w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
               >
                 فتح مولد الصور
               </button>
             </div>
             <div className="text-center opacity-40 py-12">
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-amber-500">IQD CASH PRO</p>
                <p className="text-[9px] mt-2 font-bold text-slate-400">تطوير وبرمجة محمد اليسار &copy; 2025</p>
                <div className="mt-4 flex justify-center gap-4 text-xs grayscale">
                  <span>🇮🇶</span> <span>🇺🇸</span> <span>🌍</span>
                </div>
             </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-10 text-center">
        <div className="relative mb-10">
          <div className="w-20 h-20 border-2 border-amber-500/10 rounded-full"></div>
          <div className="w-20 h-20 border-t-2 border-amber-500 rounded-full animate-spin absolute top-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-amber-500 italic">ع</div>
        </div>
        <h1 className="text-2xl font-black gold-text italic tracking-tighter mb-2">دينار كاش</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] animate-pulse">Establishing secure connection...</p>
      </div>
    );
  }

  return (
    <div className="app-container bg-[#020617]">
      <header className="fixed top-0 inset-x-0 z-[100] bg-[#020617]/85 backdrop-blur-3xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-[#020617] font-black text-2xl shadow-xl shadow-amber-500/20 active:scale-90 transition-transform">ع</div>
            <div className="flex flex-col">
              <span className="font-black text-base leading-none tracking-tight">دينار كاش</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">IQD Index</span>
            </div>
          </div>
          <button 
            disabled={refreshing || !isOnline}
            onClick={() => loadData(true)} 
            className={`w-11 h-11 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-all ${refreshing ? 'animate-pulse' : ''} ${!isOnline ? 'opacity-20 grayscale' : ''}`}
          >
            {refreshing ? <span className="animate-spin text-sm">⏳</span> : <span className="text-xl">🔄</span>}
          </button>
        </div>
      </header>

      <main className="pt-28 min-h-screen">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bottom-nav z-[100] safe-pb">
        <div className="flex justify-around items-center h-22 px-4">
          <NavButton active={activeTab === 'home'} onClick={() => { triggerHaptic(); setActiveTab('home'); }} icon="🏠" label="الرئيسية" />
          <NavButton active={activeTab === 'calc'} onClick={() => { triggerHaptic(); setActiveTab('calc'); }} icon="⚖️" label="المحول" />
          <NavButton active={activeTab === 'charts'} onClick={() => { triggerHaptic(); setActiveTab('charts'); }} icon="📈" label="المؤشر" />
          <NavButton active={activeTab === 'lab'} onClick={() => { triggerHaptic(); setActiveTab('lab'); }} icon="🧪" label="المختبر" />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all flex-1 py-4 ${active ? 'scale-110' : 'opacity-40 grayscale-[0.8]'}`}>
    <span className="text-2xl drop-shadow-lg">{icon}</span>
    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${active ? 'text-amber-500' : 'text-slate-400'}`}>{label}</span>
    {active && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-0.5 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>}
  </button>
);

export default App;
