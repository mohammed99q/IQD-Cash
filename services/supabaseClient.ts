
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const supabaseUrl = 'https://dfiuyknywzwocovxqkez.supabase.co';
const supabaseAnonKey = 'sb_publishable_B8_r-aOFn6vquQTPd-7Yng_S35sCPy7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * وظيفة لجلب آخر سعر مسجل في القاعدة
 */
export const getLatestRatesFromDb = async () => {
  try {
    const { data, error } = await supabase
      .from('market_rates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Supabase fetch error:", err);
    return null;
  }
};

/**
 * وظيفة لحفظ الأسعار الجديدة في القاعدة
 */
export const saveRatesToDb = async (rates: any, analysis: any) => {
  try {
    const { error } = await supabase.from('market_rates').insert([
      { 
        rates_data: rates, 
        analysis_data: analysis,
        created_at: new Date()
      }
    ]);
    if (error) throw error;
  } catch (err) {
    console.error("Supabase save error:", err);
  }
};
