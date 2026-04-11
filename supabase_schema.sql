-- Supabase Schema for EternaVentures

-- 1. Categories Table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_names TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Blogs Table
CREATE TABLE blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Leads Table (Contact Form)
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (everyone can see blogs, projects, etc.)
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);

-- Create policy for public insert access to leads (anyone can submit contact form)
CREATE POLICY "Public insert access for leads" ON leads FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users (admins) to manage all data
CREATE POLICY "Admin full access for categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for leads" ON leads FOR ALL USING (auth.role() = 'authenticated');

-- Storage Bucket for Uploads
-- Note: You need to create a storage bucket named 'uploads' in the Supabase dashboard manually, 
-- or run the following if your user has permissions:
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage Policies
CREATE POLICY "Public Access to Uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
