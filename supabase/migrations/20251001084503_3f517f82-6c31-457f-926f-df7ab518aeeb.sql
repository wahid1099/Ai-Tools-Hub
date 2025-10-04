-- Create enum for tool categories
CREATE TYPE public.tool_category AS ENUM (
  'chatbot',
  'image',
  'video',
  'audio',
  'code',
  'productivity',
  'writing',
  'research',
  'other'
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.tool_category NOT NULL DEFAULT 'other',
  link TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read tools (public directory)
CREATE POLICY "Anyone can view tools"
  ON public.tools
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert tools (admins)
CREATE POLICY "Authenticated users can insert tools"
  ON public.tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update tools
CREATE POLICY "Authenticated users can update tools"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete tools
CREATE POLICY "Authenticated users can delete tools"
  ON public.tools
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for tool logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-logos', 'tool-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tool logos
CREATE POLICY "Anyone can view tool logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tool-logos');

CREATE POLICY "Authenticated users can upload tool logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tool-logos');

CREATE POLICY "Authenticated users can update tool logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tool-logos');

CREATE POLICY "Authenticated users can delete tool logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'tool-logos');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();