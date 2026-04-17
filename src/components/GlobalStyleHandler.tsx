import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function GlobalStyleHandler() {
  const [typo, setTypo] = useState<any>(null);

  useEffect(() => {
    async function fetchTypo() {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'typography_settings')
        .single();
      
      if (data && data.setting_value) {
        setTypo(data.setting_value);
      }
    }

    fetchTypo();

    // Subscribe to changes
    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, (payload) => {
        if (payload.new.setting_key === 'typography_settings') {
          setTypo(payload.new.setting_value);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!typo) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --font-sans: ${typo.font_sans};
        --font-display: ${typo.font_display};
      }
      
      body, .font-sans {
        font-family: var(--font-sans) !important;
      }
      
      h1, h2, h3, h4, .font-display {
        font-family: var(--font-display) !important;
      }
    `}} />
  );
}
