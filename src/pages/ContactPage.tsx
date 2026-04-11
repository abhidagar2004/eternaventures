import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase
          .from('contact_page_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) setContent(data);
      } catch (err) {
        console.error("Error fetching contact page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !content) {
    return (
      <div className="pt-40 flex justify-center py-20 bg-black min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>
    );
  }

  const c = content;

  return (
    <div 
      className={`pt-20 min-h-screen ${c.font_style || 'font-sans'}`}
      style={{ backgroundColor: c.page_bg_color || '#000000', color: c.page_text_color || '#ffffff' }}
    >
      <PageHeader 
        badge={c.banner_badge}
        badgeColor={c.banner_badge_color}
        title={c.heading} 
        titleColor={c.hero_text_color || '#ffffff'}
        titleSize={c.banner_heading_size}
        description={c.subheading} 
        descColor={c.hero_text_color || '#9ca3af'}
        descSize={c.banner_subheading_size}
        bgImage={c.banner_image}
        overlayColor={c.banner_overlay_color || '#000000'}
        overlayOpacity={c.banner_overlay_opacity}
        paddingTop={c.banner_padding_top || "200"}
        paddingBottom={c.banner_padding_bottom || "100"}
        bgColor={c.hero_bg_color || '#000000'}
        textColor={c.hero_text_color || '#ffffff'}
      />

      {c.contact_heading_text && c.contact_heading_text.trim() !== "" && (
        <Contact 
          sectionBgColor={c.contact_section_bg_color}
          sectionBorderColor={c.contact_section_border_color}
          tagText={c.contact_tag_text}
          tagColor={c.contact_tag_color}
          headingText={c.contact_heading_text}
          headingColor={c.contact_heading_color}
          headingSize={c.contact_heading_size}
          descText={c.contact_desc_text}
          descColor={c.contact_desc_color}
          descSize={c.contact_desc_size}
          iconBgColor={c.info_icon_bg_color}
          iconColor={c.info_icon_color}
          labelColor={c.info_label_color}
          infoTextColor={c.info_text_color}
          formBgColor={c.form_bg_color}
          formBorderColor={c.form_border_color}
          inputBgColor={c.input_bg_color}
          inputBorderColor={c.input_border_color}
          inputTextColor={c.input_text_color}
          labelText_color={c.label_text_color}
          btnBgColor={c.btn_bg_color}
          btnTextColor={c.btn_text_color}
          btnHoverBgColor={c.btn_hover_bg_color}
          btnRadius={c.btn_radius}
          formNamePlaceholder={c.form_name_placeholder}
          formEmailPlaceholder={c.form_email_placeholder}
          formPhonePlaceholder={c.form_phone_placeholder}
          formMessagePlaceholder={c.form_message_placeholder}
          formButtonText={c.form_button_text}
          initialContactInfo={c}
        />
      )}

      <FAQ 
        sectionBgColor={c.faq_section_bg_color}
        sectionBorderColor={c.faq_section_border_color}
        tagColor={c.faq_tag_color}
        headingColor={c.faq_heading_color}
        itemBgColor={c.faq_item_bg_color}
        itemBorderColor={c.faq_item_border_color}
        questionColor={c.faq_question_color}
        answerColor={c.faq_answer_color}
        iconColor={c.faq_icon_color}
        hoverColor={c.faq_hover_color || '#2596be'}
      />
    </div>
  );
}
