
import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  label?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', label = "مساحة إعلانية" }) => {
  return (
    <div className="w-full my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-2 px-4">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>
      <div className="ad-placeholder min-h-[100px] flex items-center justify-center rounded-2xl transition-all hover:bg-white/5 group relative">
        {/* هذا هو الجزء الذي تضعه فيه كود AdSense الحقيقي */}
        {/* 
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot={slot}
               data-ad-format={format}
               data-full-width-responsive="true"></ins>
        */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 group-hover:text-amber-500/50 transition-colors uppercase italic">Google AdSense Space</p>
          <p className="text-[8px] text-slate-700 mt-1 italic">سيظهر الإعلان هنا بعد تفعيل الحساب</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
