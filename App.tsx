
import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchIqdData, generateAppAssets } from './services/geminiService';
import { CurrencyRate, MarketAnalysis, ChartData } from './types';
import RateCard from './components/RateCard';
import Converter from './components/Converter';
import AdBanner from './components/AdBanner';

const App: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [activeTimeframe, setActiveTimeframe] = useState('1W');

  const historicalData: ChartData[] = [
    { date: 'الأحد', price: 1510 }, { date: 'الاثنين', price: 1522 }, { date: 'الثلاثاء', price: 1515 },
    { date: 'الأربعاء', price: 1532 }, { date: 'الخميس', price: 1525 }, { date: 'الجمعة', price: 1528 },
    { date: 'السبت', price: 1530 },
  ];

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const data = await fetchIqdData();
      setRates(data.rates);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerate = async (type: 'icon' | 'banner') => {
    setGenerating(true);
    try {
      const url = await generateAppAssets(type);
      setGeneratedImage(url);
    } catch (err) {
      alert("حدث خطأ أثناء التوليد. تأكد من اتصالك بالإنترنت.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-amber-500 font-black text-xl italic tracking-tighter">IQD</div>
        </div>
        <h2 className="mt-8 text-white font-bold text-xl animate-pulse">دينار كاش</h2>
        <p className="mt-2 text-slate-500 text-xs font-black tracking-widest uppercase">جاري استلام بيانات السوق...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-amber-500/30 selection:text-amber-500 overflow-x-hidden">
      {/* Ticker Tape */}
      <div className="ticker-wrap sticky top-0 z-[60] bg-[#020617]/90 backdrop-blur-xl">
        <div className="ticker flex gap-20 py-2">
          {[...rates, ...rates].map((r, i) => (
            <div key={`${r.code}-${i}`} className="flex items-center gap-3 text-[11px] font-black uppercase">
              <span className="text-slate-500">{r.name}</span>
              <span className="text-amber-400">IQD {r.parallelRate?.toLocaleString()}</span>
              <span className={r.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {r.change >= 0 ? '▲' : '▼'} {Math.abs(r.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <header className="px-6 py-10 border-b border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center text-[#020617] text-5xl shadow-2xl shadow-amber-500/20 transform hover:scale-105 transition-transform cursor-pointer">
              <span className="font-black italic">ع</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter gold-text">دينار كاش</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تحديث مباشر: {analysis?.lastUpdated}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => loadData(true)}
              disabled={refreshing}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border border-white/10 ${refreshing ? 'opacity-50 cursor-wait' : 'bg-white/5 hover:bg-white/10 active:scale-95'}`}
            >
              <span>{refreshing ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            </button>
            <div className="hidden lg:block h-10 w-px bg-white/5"></div>
            <div className="hidden lg:block text-left">
              <p className="text-[9px] font-black text-amber-500/50 uppercase mb-1">المطور المسؤول</p>
              <a href="https://www.linkedin.com/in/mohammed-alyasar99/" target="_blank" rel="noopener noreferrer" className="text-sm font-black hover:text-amber-500 transition-colors">محمد اليسار</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        <div className="max-w-4xl mx-auto">
          <AdBanner label="إعلان ممول" />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="premium-card rounded-[3rem] p-8 md:p-12 border border-white/5 overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    مؤشر الدولار
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">بورصة الكفاح</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">متابعة دقيقة للتغيرات السعرية خلال الفترة الماضية</p>
                </div>
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                  {['1D', '1W', '1M', '1Y'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setActiveTimeframe(t)}
                      className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${activeTimeframe === t ? 'bg-amber-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={15} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #eab30833', borderRadius: '20px', padding: '15px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
                      cursor={{ stroke: '#eab308', strokeWidth: 1 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#eab308" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#goldGradient)"
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <span className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl">💡</span>
                      تحليل السوق الذكي
                    </h3>
                    <div className="p-6 bg-black/30 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed font-medium italic">
                      {analysis?.summary}
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-xs font-black text-amber-500/60 uppercase tracking-[0.3em]">المصادر الحكومية</h3>
                    <div className="space-y-3">
                      {analysis?.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-amber-500 hover:text-slate-900 transition-all border border-white/5">
                          <span className="text-[11px] font-bold truncate max-w-[200px]">{s.title}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                        </a>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <Converter rates={rates} />
            
            <AdBanner label="Ad Zone" />

            {/* مختبر الهوية - خاص بتوليد الأيقونة */}
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-8 rounded-[2.5rem] border border-amber-500/20 shadow-xl shadow-amber-500/5">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">مختبر أيقونة البرنامج</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                استخدم الذكاء الاصطناعي لتصميم أيقونة "دينار كاش" الحصرية لتطبيقك قبل رفعه للمتجر.
              </p>
              
              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={() => handleGenerate('icon')} 
                  disabled={generating} 
                  className="w-full bg-amber-500 text-slate-900 py-3 rounded-xl text-[11px] font-black uppercase hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {generating ? 'جاري التصميم...' : '✨ ابتكار أيقونة ذكية'}
                </button>
              </div>
              
              {generatedImage && (
                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 p-2">
                    <img src={generatedImage} alt="Generated Icon" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <button 
                    onClick={() => { const l=document.createElement('a'); l.href=generatedImage; l.download='app-icon.png'; l.click(); }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black border border-white/10"
                  >
                    حفظ أيقونة البرنامج
                  </button>
                  <p className="text-[9px] text-center text-slate-500 italic">ملاحظة: هذه الأيقونة جاهزة للاستخدام في Play Store Console.</p>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tighter">الأسواق العالمية</h2>
              <p className="text-slate-500 text-sm mt-3">سعر صرف العملات الأجنبية مقابل الدينار (ألف وحدة)</p>
            </div>
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase">
              Global Financial Hub
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rates.slice(0, 2).map(rate => (
              <RateCard key={rate.code} rate={rate} />
            ))}
            <div className="sm:col-span-1 lg:col-span-2">
              <AdBanner label="Sponsored" />
            </div>
            {rates.slice(2).map(rate => (
              <RateCard key={rate.code} rate={rate} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-40 border-t border-white/5 pt-20 pb-12 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-6">
              <div className="text-3xl font-black gold-text italic tracking-tighter">Dinar Cash</div>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed font-medium">
                المنصة الأولى والوحيدة في العراق التي تدمج بين أخبار السوق الموازي وتحليلات الذكاء الاصطناعي لتقديم أدق تجربة مالية للمستخدم والمستثمر.
              </p>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">تطوير المشروع</h5>
              <div className="space-y-2">
                <a href="https://www.linkedin.com/in/mohammed-alyasar99/" target="_blank" rel="noopener noreferrer" className="text-lg font-black text-white hover:text-amber-500 transition-colors">محمد اليسار</a>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic leading-none">Senior Fintech Architect</p>
              </div>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">روابط سريعة</h5>
              <nav className="flex flex-col gap-4 text-xs font-bold text-slate-400">
                <a href="#" className="hover:text-amber-500 transition-colors">عن دينار كاش</a>
                <a href="#" className="hover:text-amber-500 transition-colors">الأسئلة الشائعة</a>
                <a href="#" className="hover:text-amber-500 transition-colors">سياسة الخصوصية</a>
              </nav>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <p>© {new Date().getFullYear()} DINAR CASH PROJECT. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-2">
              BUIILT WITH <span className="text-rose-600 text-lg">♥</span> BY <a href="https://github.com/mohammed99q" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">M. ALYASAR</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
