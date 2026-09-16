import { supabase } from '../../supabase';

export const uploadImageToSupabase = async (file: File, bucket: string = 'avatars') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err: any) {
    console.error('Error uploading image:', err.message);
    return null;
  }
};
