import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File, bucket: string = 'uploads') => {
  const filePath = `${file.name}`;

  const { error: uploadError, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
