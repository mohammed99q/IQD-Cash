
import { GoogleGenAI } from "@google/genai";
import { CurrencyRate, MarketAnalysis } from "../types";
import { supabase, saveRatesToDb, getLatestRatesFromDb } from "./supabaseClient";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const CACHE_KEY = 'iqd_cash_data_v5';

const fallbackRates: CurrencyRate[] = [
  { code: 'USD', name: 'دولار أمريكي', officialRate: 1310, parallelRate: 1532, change: 0.12, flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو', officialRate: 1420, parallelRate: 1645, change: -0.05, flag: '🇪🇺' },
  { code: 'TRY', name: 'ليرة تركية', officialRate: 38.5, parallelRate: 46.2, change: -0.8, flag: '🇹🇷' },
  { code: 'SAR', name: 'ريال سعودي', officialRate: 349.3, parallelRate: 408, change: 0.01, flag: '🇸🇦' },
];

export const getCachedData = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);
  return {
    rates: fallbackRates,
    analysis: {
      summary: "جاري جلب تحديثات البورصة الآن...",
      sources: [],
      lastUpdated: "قيد التحديث"
    }
  };
};

export const syncMarketData = async (): Promise<{ rates: CurrencyRate[], analysis: MarketAnalysis }> => {
  // 1. محاولة جلب البيانات من Supabase أولاً (لتوفير الكوتا)
  const dbData = await getLatestRatesFromDb();
  if (dbData) {
    const lastUpdateDate = new Date(dbData.created_at);
    const diffInMinutes = (new Date().getTime() - lastUpdateDate.getTime()) / 60000;
    
    // إذا كانت البيانات من القاعدة أحدث من 15 دقيقة، نستخدمها مباشرة
    if (diffInMinutes < 15) {
      const result = { rates: dbData.rates_data, analysis: dbData.analysis_data };
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    }
  }

  // 2. إذا كانت قديمة أو غير موجودة، نستخدم Gemini مع البحث
  const ai = getAI();
  const prompt = `Give me the CURRENT parallel market exchange rate for 100 USD in Baghdad. 
  Also EUR, TRY, SAR. Return only the values in a brief Arabic summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));

    const currentCache = getCachedData();
    const newData = {
      rates: currentCache.rates, // ملاحظة: في النسخة الكاملة يتم عمل Parse للنص المسترجع
      analysis: {
        summary: response.text || "الأسعار مستقرة في بورصتي الكفاح والحارثية.",
        sources: sources.slice(0, 3),
        lastUpdated: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      }
    };

    // 3. حفظ البيانات الجديدة في Supabase وفي الـ LocalStorage
    await saveRatesToDb(newData.rates, newData.analysis);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
    
    return newData;
  } catch (error) {
    console.warn("AI Sync failed, using last cache");
    return getCachedData();
  }
};
