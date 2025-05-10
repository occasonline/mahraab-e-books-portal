
import { supabase } from '@/lib/supabase';
import { WebsiteSettings } from '@/types/supabase';

// استرجاع إعدادات الموقع
export const getWebsiteSettings = async () => {
  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
    console.error('خطأ في استرجاع إعدادات الموقع:', error);
    throw error;
  }
  
  return data as WebsiteSettings;
};

// تحديث إعدادات الموقع
export const updateWebsiteSettings = async (settings: Omit<WebsiteSettings, 'id' | 'created_at'>) => {
  // التحقق من وجود إعدادات مسبقًا
  const { data: existingSettings } = await supabase
    .from('website_settings')
    .select('id')
    .limit(1);
  
  let result;
  
  if (existingSettings && existingSettings.length > 0) {
    // تحديث الإعدادات الموجودة
    const { data, error } = await supabase
      .from('website_settings')
      .update(settings)
      .eq('id', existingSettings[0].id)
      .select();
    
    if (error) {
      console.error('خطأ في تحديث إعدادات الموقع:', error);
      throw error;
    }
    
    result = data[0];
  } else {
    // إنشاء إعدادات جديدة
    const { data, error } = await supabase
      .from('website_settings')
      .insert([settings])
      .select();
    
    if (error) {
      console.error('خطأ في إنشاء إعدادات الموقع:', error);
      throw error;
    }
    
    result = data[0];
  }
  
  return result as WebsiteSettings;
};
