-- Create the projects_page_content table
CREATE TABLE IF NOT EXISTS public.projects_page_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Banner Section
    banner_bg_image TEXT DEFAULT 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop',
    banner_heading TEXT DEFAULT 'Our Work',
    banner_heading_color TEXT DEFAULT '#ffffff',
    banner_heading_size TEXT DEFAULT 'text-6xl md:text-8xl',
    banner_subheading TEXT DEFAULT 'Explore how we''ve helped ambitious brands scale their revenue, build their communities, and dominate their industries.',
    banner_subheading_color TEXT DEFAULT '#9ca3af',
    banner_subheading_size TEXT DEFAULT 'text-xl md:text-2xl',
    
    -- Numbers Section (TrustBar)
    numbers_bg_color TEXT DEFAULT '#2596be',
    numbers_text_color TEXT DEFAULT '#ffffff',
    numbers_stat1_value TEXT DEFAULT '$500M+',
    numbers_stat1_label TEXT DEFAULT 'Revenue Generated',
    numbers_stat2_value TEXT DEFAULT '10B+',
    numbers_stat2_label TEXT DEFAULT 'Impressions',
    numbers_stat3_value TEXT DEFAULT '50+',
    numbers_stat3_label TEXT DEFAULT 'Industry Awards',
    
    -- Our Work Section (Case Studies)
    our_work_bg_color TEXT DEFAULT '#000000',
    our_work_tag TEXT DEFAULT 'Case Studies',
    our_work_tag_color TEXT DEFAULT '#2596be',
    our_work_tag_size TEXT DEFAULT 'text-sm',
    our_work_heading TEXT DEFAULT 'Featured Projects',
    our_work_heading_color TEXT DEFAULT '#ffffff',
    our_work_heading_size TEXT DEFAULT 'text-5xl md:text-7xl',
    our_work_cta_text TEXT DEFAULT 'Start a project',
    our_work_cta_color TEXT DEFAULT '#ffffff',
    our_work_cta_size TEXT DEFAULT 'text-sm',
    our_work_category_btn_color TEXT DEFAULT '#1f2937',
    our_work_category_btn_active_color TEXT DEFAULT '#2596be',
    our_work_category_text_color TEXT DEFAULT '#9ca3af',
    our_work_category_text_active_color TEXT DEFAULT '#ffffff',
    
    -- Reviews Section (Testimonials)
    reviews_bg_color TEXT DEFAULT '#000000',
    reviews_tag TEXT DEFAULT 'Client Love',
    reviews_tag_color TEXT DEFAULT '#2596be',
    reviews_tag_size TEXT DEFAULT 'text-sm',
    reviews_heading TEXT DEFAULT 'Don''t just take our word for it.',
    reviews_heading_color TEXT DEFAULT '#ffffff',
    reviews_heading_size TEXT DEFAULT 'text-5xl md:text-7xl',
    
    -- CTA Section
    cta_bg_color TEXT DEFAULT '#2596be',
    cta_heading TEXT DEFAULT 'Want Results Like These?',
    cta_heading_color TEXT DEFAULT '#ffffff',
    cta_heading_size TEXT DEFAULT 'text-5xl md:text-7xl',
    cta_subheading TEXT DEFAULT 'We''ve helped dozens of brands scale past 7 and 8 figures. You could be next.',
    cta_subheading_color TEXT DEFAULT '#ffffff',
    cta_subheading_size TEXT DEFAULT 'text-xl md:text-2xl',
    cta_btn_text TEXT DEFAULT 'Get Your Free Growth Audit',
    cta_btn_color TEXT DEFAULT '#ffffff',
    cta_btn_text_color TEXT DEFAULT '#000000'
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects_page_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects_page_content' AND policyname = 'Allow public read access on projects_page_content') THEN
        CREATE POLICY "Allow public read access on projects_page_content" ON public.projects_page_content FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects_page_content' AND policyname = 'Allow authenticated users to insert projects_page_content') THEN
        CREATE POLICY "Allow authenticated users to insert projects_page_content" ON public.projects_page_content FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects_page_content' AND policyname = 'Allow authenticated users to update projects_page_content') THEN
        CREATE POLICY "Allow authenticated users to update projects_page_content" ON public.projects_page_content FOR UPDATE TO authenticated USING (true);
    END IF;
END
$$;

-- Insert a default row ONLY if the table is completely empty
INSERT INTO public.projects_page_content (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM public.projects_page_content);
