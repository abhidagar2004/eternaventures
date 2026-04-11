import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import CaseStudies from '../components/CaseStudies';
import TrustBar from '../components/TrustBar';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function ProjectsPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('projects_page_content')
          .select('*')
          .limit(1)
          .single();
        
        if (data && !error) {
          setContent(data);
        }
      } catch (e) {
        console.log("projects_page_content table might not exist yet.");
      }
    };

    fetchContent();
  }, []);

  return (
    <div 
      className={`pt-20 min-h-screen ${content?.font_style || ''}`}
      style={{ backgroundColor: content?.page_bg_color || '#000000', color: content?.page_text_color || '#ffffff' }}
    >
      <PageHeader 
        title={content?.banner_heading} 
        description={content?.banner_subheading} 
        bgImage={content?.banner_bg_image}
        titleColor={content?.banner_heading_color}
        titleSize={content?.banner_heading_size}
        descColor={content?.banner_subheading_color}
        descSize={content?.banner_subheading_size}
        paddingTop={content?.banner_padding_top || "200"}
        paddingBottom={content?.banner_padding_bottom || "100"}
      />
      <TrustBar 
        bgColor={content?.numbers_bg_color}
        textColor={content?.numbers_text_color}
        stats={content && (content.numbers_stat1_value || content.numbers_stat2_value || content.numbers_stat3_value) ? [
          { value: content.numbers_stat1_value, label: content.numbers_stat1_label },
          { value: content.numbers_stat2_value, label: content.numbers_stat2_label },
          { value: content.numbers_stat3_value, label: content.numbers_stat3_label },
          ...(content.numbers_stat4_value ? [{ value: content.numbers_stat4_value, label: content.numbers_stat4_label }] : [])
        ].filter(s => s.value || s.label) : undefined}
      />
      {content?.our_work_heading && content.our_work_heading.trim() !== "" && (
        <CaseStudies 
          bgColor={content?.our_work_bg_color}
          tag={content?.our_work_tag}
          tagColor={content?.our_work_tag_color}
          tagSize={content?.our_work_tag_size}
          heading={content?.our_work_heading}
          headingColor={content?.our_work_heading_color}
          headingSize={content?.our_work_heading_size}
          ctaText={content?.our_work_cta_text}
          ctaColor={content?.our_work_cta_color}
          ctaSize={content?.our_work_cta_size}
          categoryBtnColor={content?.our_work_category_btn_color}
          categoryBtnActiveColor={content?.our_work_category_btn_active_color}
          categoryTextColor={content?.our_work_category_text_color}
          categoryTextActiveColor={content?.our_work_category_text_active_color}
        />
      )}
      {content?.reviews_heading && content.reviews_heading.trim() !== "" && (
        <Testimonials 
          bgColor={content?.reviews_bg_color}
          tag={content?.reviews_tag}
          tagColor={content?.reviews_tag_color}
          tagSize={content?.reviews_tag_size}
          title={content?.reviews_heading}
          titleColor={content?.reviews_heading_color}
          titleSize={content?.reviews_heading_size}
        />
      )}
      {content?.cta_heading && content.cta_heading.trim() !== "" && (
        <CTA 
          title={content?.cta_heading} 
          description={content?.cta_subheading}
          buttonText={content?.cta_btn_text}
          buttonLink="/contact"
          theme="gold"
          bgColor={content?.cta_bg_color}
          titleColor={content?.cta_heading_color}
          titleSize={content?.cta_heading_size}
          descColor={content?.cta_subheading_color}
          descSize={content?.cta_subheading_size}
          btnColor={content?.cta_btn_color}
          btnTextColor={content?.cta_btn_text_color}
          btnRadius={content?.cta_btn_radius}
        />
      )}
    </div>
  );
}
