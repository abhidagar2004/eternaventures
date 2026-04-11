import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';
import Process from '../components/Process';
import WhyUs from '../components/WhyUs';
import CTA from '../components/CTA';

export default function ServicesPage() {
  const [content, setContent] = useState<any>({
    heading: '',
    subheading: '',
    cta_heading: '',
    cta_subheading: '',
    cta_btn_text: '',
    cta_btn_link: '/projects',
    page_bg_color: '#000000',
    page_text_color: '#ffffff',
    header_bg_color: '#000000',
    header_text_color: '#ffffff',
    header_heading_size: 'text-6xl md:text-8xl',
    header_subheading_size: 'text-xl',
    services_bg_color: '#000000',
    services_text_color: '#ffffff',
    services_card_bg: '#111111',
    services_tag: '',
    services_tag_color: '#2596be',
    services_heading: '',
    services_heading_size: 'text-5xl md:text-7xl',
    services_desc: '',
    process_bg_color: '#111111',
    process_text_color: '#ffffff',
    why_us_bg_color: '#000000',
    why_us_text_color: '#ffffff',
    cta_bg_color: '#2596be',
    cta_text_color: '#ffffff',
    cta_heading_size: 'text-5xl md:text-7xl',
    cta_subheading_size: 'text-xl md:text-2xl'
  });

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from('services_page_content').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (data) setContent(data);
    }
    fetchContent();
  }, []);

  return (
    <div className={`pt-20 min-h-screen ${content.font_style || ''}`} style={{ backgroundColor: content.page_bg_color, color: content.page_text_color }}>
      <PageHeader 
        title={content.heading} 
        description={content.subheading} 
        bgColor={content.header_bg_color}
        textColor={content.header_text_color}
        titleSize={content.header_heading_size}
        descSize={content.header_subheading_size}
        bgImage={content.header_bg_image}
        overlayColor={content.header_overlay_color}
        overlayOpacity={content.header_overlay_opacity}
        paddingTop={content.banner_padding_top || "200"}
        paddingBottom={content.banner_padding_bottom || "100"}
      />
      {content.services_heading && content.services_heading.trim() !== "" && (
        <Services
          bgColor={content.services_bg_color}
          textColor={content.services_text_color}
          cardBgColor={content.services_card_bg}
          tag={content.services_tag}
          tagColor={content.services_tag_color}
          heading={content.services_heading}
          headingSize={content.services_heading_size}
          description={content.services_desc}
        />
      )}
      {content.process_heading && content.process_heading.trim() !== "" && (
        <Process
          bgColor={content.process_bg_color}
          textColor={content.process_text_color}
          heading={content.process_heading}
          tag={content.process_tag}
          tagColor={content.process_tag_color}
          circleBgColor={content.process_circle_bg_color}
          circleBorderColor={content.process_circle_border_color}
          circleTextColor={content.process_circle_text_color}
        />
      )}
      {content.why_us_heading && content.why_us_heading.trim() !== "" && (
        <WhyUs
          bgColor={content.why_us_bg_color}
          textColor={content.why_us_text_color}
          heading={content.why_us_heading}
          headingColor={content.why_us_heading_color}
          tag={content.why_us_tag}
          tagColor={content.why_us_tag_color}
          cardBgColor={content.why_us_card_bg_color}
          iconColor={content.why_us_icon_color}
        />
      )}
      {content.cta_heading && content.cta_heading.trim() !== "" && (
        <CTA 
          title={content.cta_heading} 
          description={content.cta_subheading}
          buttonText={content.cta_btn_text}
          buttonLink={content.cta_btn_link}
          bgColor={content.cta_bg_color}
          titleColor={content.cta_text_color}
          descColor={content.cta_text_color}
          titleSize={content.cta_heading_size}
          descSize={content.cta_subheading_size}
          btnRadius={content.cta_btn_radius}
          btnColor={content.cta_btn_color}
          btnTextColor={content.cta_btn_text_color}
        />
      )}
    </div>
  );
}
