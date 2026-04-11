import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import TrustBar from '../components/TrustBar';
import CTA from '../components/CTA';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from('about_page_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setContent(data);
    }
    fetchContent();
  }, []);

  const c = content || {};

  return (
    <div
      className={`pt-20 min-h-screen ${c.font_style || 'font-sans'}`}
      style={{ backgroundColor: c.page_bg_color || '#000000', color: c.page_text_color || '#ffffff' }}
    >
      <PageHeader
        title={c.banner_heading}
        description={c.banner_subheading}
        bgImage={c.banner_bg_image}
        overlayColor={c.banner_overlay_color || '#000000'}
        overlayOpacity={c.banner_overlay_opacity ?? 0.5}
        titleColor={c.banner_heading_color || '#ffffff'}
        titleSize={c.banner_heading_size || 'text-6xl md:text-8xl'}
        descColor={c.banner_subheading_color || '#9ca3af'}
        descSize={c.banner_subheading_size || 'text-xl md:text-2xl'}
        paddingTop={c.banner_padding_top || "200"}
        paddingBottom={c.banner_padding_bottom || "100"}
      />

      {c.about_heading && c.about_heading.trim() !== "" && (
        <About
          bgColor={c.about_bg_color}
          tag={c.about_tag}
          tagColor={c.about_tag_color}
          heading={c.about_heading}
          headingColor={c.about_heading_color}
          headingSize={c.about_heading_size}
          mission={c.mission_text}
          vision={c.vision_text}
          story={c.story_text}
          textColor={c.about_text_color}
          yearFounded={c.year_founded}
          yearFoundedLabel={c.year_founded_label}
          globalValue={c.global_value}
          globalReach={c.global_label}
          imageUrl={c.image_url}
          imageOverlayColor={c.about_image_overlay_color}
          imageOverlayOpacity={c.about_image_overlay_opacity}
        />
      )}

      {content && (c.trust_stat1_value || c.trust_stat2_value || c.trust_stat3_value || c.trust_stat4_value) && (
        <TrustBar
          bgColor={c.trust_bg_color}
          textColor={c.trust_text_color}
          stats={[
            { value: c.trust_stat1_value, label: c.trust_stat1_label },
            { value: c.trust_stat2_value, label: c.trust_stat2_label },
            { value: c.trust_stat3_value, label: c.trust_stat3_label },
            { value: c.trust_stat4_value, label: c.trust_stat4_label },
          ].filter(s => s.value || s.label)}
        />
      )}

      {c.why_us_heading && c.why_us_heading.trim() !== "" && (
        <WhyUs
          bgColor={c.why_us_bg_color}
          textColor={c.why_us_text_color}
          heading={c.why_us_heading}
          headingColor={c.why_us_heading_color}
          tag={c.why_us_tag}
          tagColor={c.why_us_tag_color}
          cardBgColor={c.why_us_card_bg_color}
          iconColor={c.why_us_icon_color}
        />
      )}

      {c.cta_heading && c.cta_heading.trim() !== "" && (
        <CTA
          title={c.cta_heading}
          description={c.cta_subheading}
          buttonText={c.cta_btn_text}
          buttonLink={c.btn_link || '/contact'}
          theme="dark"
          bgColor={c.cta_bg_color}
          titleColor={c.cta_heading_color}
          titleSize={c.cta_heading_size}
          descColor={c.cta_subheading_color}
          descSize={c.cta_subheading_size}
          btnColor={c.cta_btn_color}
          btnTextColor={c.cta_btn_text_color}
          btnRadius={c.cta_btn_radius}
        />
      )}
    </div>
  );
}
