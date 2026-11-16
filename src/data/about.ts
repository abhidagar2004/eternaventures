export const ABOUT_DEFAULTS: Record<string, string> = {
  banner_heading: 'We design how brands are understood.',
  banner_subheading: 'A growth media company from Jaipur for brands that want to lead their category.',
  who_we_are_heading: 'Who We Are',
  who_we_are_text: 'Most brands aren’t limited by resources. They’re limited by how they’re understood. We work with founders and teams to build brands with a clear position.',
  what_we_believe_heading: 'What We Believe',
  what_we_believe_text: 'Perception drives attention.\nAttention builds trust.\nTrust drives growth.',
  our_approach_heading: 'Our Approach',
  our_approach_text: 'We bring brand, content, performance, and experience together to build brands with clarity, demand, and lasting authority.',
  why_eterna_heading: 'Why EternaVentures',
  why_eterna_text: 'Clarity before execution. Direction before scale. Systems over scattered efforts.',
  who_we_work_with_heading: 'Who We Work With',
  who_we_work_with_text: 'Founders and ambitious teams ready to lead their category, from Jaipur to global markets.',
  our_role_heading: 'Our Role',
  our_role_text: 'A strategy and execution partner who connects the work to your long-term direction.',
  cta_heading: 'Join Our Mission',
  cta_subheading: 'We’re always looking to collaborate with brands and creatives who care about building what’s next.',
  cta_btn_text: 'Contact Our Team',
  btn_link: '/contact',
  cta_email: 'hello@eternaventures.in',
  trust_stat1_value: '50', trust_stat1_label: 'Brands Scaled',
  trust_stat2_value: '₹50Cr', trust_stat2_label: 'Ad Spend Managed',
  trust_stat3_value: '100M', trust_stat3_label: 'Reach Generated',
  trust_stat4_value: '4.9/5', trust_stat4_label: 'Client Rating',
};

const legacyCopy: Record<string, string> = {
  "banner_subheading": "EternaVentures is a growth media company based in Jaipur — built for brands that want to lead their category, not just participate in it.",
  "who_we_are_text": "EternaVentures was built on a simple observation:\n\nMost brands are not limited by resources.\nThey are limited by how they are perceived.\n\nThey invest in marketing, content, and campaigns — but without a clear position, everything becomes fragmented. The result is inconsistent growth, unclear messaging, and a brand that feels replaceable.\n\nWe exist to bring structure to that chaos.\n\nWe work with founders and teams to define, build, and scale brands with clarity — so every action contributes to long-term market authority.",
  "what_we_believe_text": "We don't look at marketing as a set of activities.\nWe look at it as a system of signals.\n\nEvery brand is constantly communicating — through its content, design, pricing, presence, and decisions.\n\nMost brands don't control these signals.\nWe help you take control of them.\n\nBecause in today's market:\nPerception drives attention\nAttention drives trust\nTrust drives growth",
  "our_approach_text": "We don't operate through isolated services.\nWe build interconnected growth systems.\n\nInstead of treating branding, content, performance, and experience separately — we align them.\n\nYour positioning defines your communication\nYour communication attracts the right audience\nYour audience informs your performance\nYour performance strengthens your strategy\n\nThis creates consistency, efficiency, and compounding growth over time.",
  "why_eterna_text": "Because most growth today is reactive.\n\nBrands follow trends, copy competitors, and optimize for short-term metrics — without building long-term value.\n\nWe take a different approach.\n\nWe focus on:\nClarity before execution\nDirection before scale\nSystems over scattered efforts\n\nThe goal is not just visibility.\nThe goal is to become the obvious choice in your category.",
  "who_we_work_with_text": "We partner with brands that think beyond immediate results.\n\nTypically, the brands we work with:\nWant to build strong positioning, not just presence\nAre open to rethinking their current approach\nValue strategy as much as execution\nAim to grow with consistency, not unpredictability\n\nFrom Jaipur to global markets, we work with brands driven by ambition — not just activity.",
  "our_role_text": "We don't position ourselves as vendors.\n\nWe work as strategic partners — closely involved in how your brand thinks, communicates, and grows.\n\nOur role is to bring:\nClarity where there is confusion\nStructure where there is inconsistency\nDirection where there is noise",
  "cta_subheading": "Whether you're a brand looking to scale or a creative               looking for your next home, we want to hear from you."
};

/** Apply the new concise reference copy to seeded text while preserving later custom edits. */
export function resolveAboutContent(data: Record<string, unknown>): Record<string, string> {
  const content = { ...ABOUT_DEFAULTS };
  for (const key of Object.keys(ABOUT_DEFAULTS)) {
    const value = data[key];
    if (typeof value !== 'string' || !value.trim()) continue;
    const text = value.trim();
    if (legacyCopy[key] && text === legacyCopy[key]) continue;
    content[key] = text;
  }
  return content;
}

export const ABOUT_DISCIPLINES = [
  { name: 'Branding', description: 'Define the position and identity.' },
  { name: 'Content', description: 'Tell a story people remember.' },
  { name: 'Performance', description: 'Turn attention into measurable demand.' },
  { name: 'Experience', description: 'Make the brand consistent at every touchpoint.' },
];
