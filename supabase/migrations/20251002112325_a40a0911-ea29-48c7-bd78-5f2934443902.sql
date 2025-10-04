-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create tool_submissions table
CREATE TABLE public.tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT NOT NULL,
  logo_url TEXT,
  submitter_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS on tool_submissions
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;

-- Submissions policies
CREATE POLICY "Anyone can submit tools"
  ON public.tool_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all submissions"
  ON public.tool_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
  ON public.tool_submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create page_visits table for analytics
CREATE TABLE public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS on page_visits
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Page visits policies
CREATE POLICY "Anyone can insert visits"
  ON public.page_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view visits"
  ON public.page_visits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Chatbots', 'chatbots', '💬', 'AI-powered conversational assistants'),
  ('Presentations', 'presentations', '📊', 'AI tools for creating presentations'),
  ('Coding', 'coding', '💻', 'AI coding assistants and tools'),
  ('Emails', 'emails', '📧', 'AI email writing and management'),
  ('Image', 'image', '🎨', 'AI image generation and editing'),
  ('Spreadsheet', 'spreadsheet', '📈', 'AI spreadsheet tools'),
  ('Meetings', 'meetings', '👥', 'AI meeting assistants'),
  ('Workflows', 'workflows', '⚙️', 'AI workflow automation'),
  ('Writing', 'writing', '✍️', 'AI writing assistants'),
  ('Scheduling', 'scheduling', '📅', 'AI scheduling tools'),
  ('Video', 'video', '🎥', 'AI video generation and editing'),
  ('Graphic Design', 'graphic-design', '🎨', 'AI graphic design tools'),
  ('Knowledge Management', 'knowledge-management', '📚', 'AI knowledge management'),
  ('Data Visualization', 'data-visualization', '📊', 'AI data visualization tools')
ON CONFLICT (slug) DO NOTHING;