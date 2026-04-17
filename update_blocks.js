import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const defaultBlocks = [
  { id: 'hero-1', type: 'hero', isVisible: true, heading: 'WE DESIGN HOW BRANDS ARE UNDERSTOOD', subtext: 'EternaVentures is a growth media company based in Jaipur — built for brands that want to lead their category, not just participate in it.', alignment: 'center', bgColor: '#000000', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-32', paddingBottom: 'pb-24' },
  { id: 'who-we-are-1', type: 'who_we_are', isVisible: true, heading: 'ETERNA VENTURES WAS BUILT ON A SIMPLE OBSERVATION:', highlightText: 'Most brands are not limited by resources. They are limited by how they are perceived.', paragraphs: 'Everything becomes fragmented without a clear position. The result is inconsistent growth, unclear messaging, and a brand that feels replicable.\n\nWe aim to bring structure to that chaos. We work with founders and teams to define, build, and scale brands with clarity — so every action contributes to long-term market authority.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop', columns: '2', alignment: 'left', bgColor: '#000000', textColor: '#d1d5db', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-24', imageOrder: 'left' },
  { id: 'what-we-believe-1', type: 'what_we_believe', isVisible: true, items: [{text:'Perception drives attention'}, {text:'Attention drives trust'}, {text:'Trust drives growth'}], alignment: 'center', bgColor: '#050505', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-24' },
  { id: 'our-approach-1', type: 'our_approach', isVisible: true, heading: 'OUR APPROACH', items: [{title: 'Positioning'}, {title: 'Communication'}, {title: 'Audience'}, {title: 'Performance'}, {title: 'Strategy'}], alignment: 'center', bgColor: '#000000', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-24', showArrows: true },
  { id: 'why-us-1', type: 'why_us', isVisible: true, heading: 'WHY ETERNAVENTURES', items: [{title: 'Clarity before execution', desc: 'We align on vision before we spend.'}, {title: 'Direction before scale', desc: 'Scale means nothing without direction.'}, {title: 'Systems over scattered efforts', desc: 'Predictable growth through proven systems.'}], columns: '3', alignment: 'left', bgColor: '#050505', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-24' },
  { id: 'who-we-work-with-1', type: 'who_we_work_with', isVisible: true, heading: 'WHO WE WORK WITH', items: [{text: 'Visionary Founders'}, {text: 'D2C Brands'}, {text: 'Growth-Stage Startups'}, {text: 'High-End Services'}], alignment: 'center', bgColor: '#000000', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-24', style: 'grid' },
  { id: 'our-role-1', type: 'our_role', isVisible: true, lines: [{text: 'Clarity in confusion.'}, {text: 'Structure in chaos.'}, {text: 'Direction in scale.'}], alignment: 'center', bgColor: '#050505', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-32', paddingBottom: 'pb-32' },
  { id: 'cta-1', type: 'cta', isVisible: true, heading: 'If you\'re building a brand that deserves to lead — we should talk.', btnText: 'Contact Us', btnLink: 'mailto:hello@eternaventures.in', email: 'hello@eternaventures.in', alignment: 'center', bgColor: '#000000', textColor: '#ffffff', accentColor: '#D6FF00', paddingTop: 'pt-24', paddingBottom: 'pb-32' }
];

async function updateDB() {
  const { data: rows } = await supabase.from('about_page_content').select('id').limit(1);
  if (rows && rows.length > 0) {
    const { error } = await supabase.from('about_page_content').update({ blocks: defaultBlocks }).eq('id', rows[0].id);
    console.log(error ? 'Error updating:' : 'Update success', error);
  } else {
    const { error } = await supabase.from('about_page_content').insert({ blocks: defaultBlocks });
    console.log(error ? 'Error inserting:' : 'Insert success', error);
  }
}

updateDB();
