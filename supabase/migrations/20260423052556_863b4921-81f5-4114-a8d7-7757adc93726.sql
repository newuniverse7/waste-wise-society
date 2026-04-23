
-- Storage bucket for waste images
INSERT INTO storage.buckets (id, name, public)
VALUES ('waste-images', 'waste-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can view, anyone can upload (demo app, no auth wall)
CREATE POLICY "Public read waste images"
ON storage.objects FOR SELECT
USING (bucket_id = 'waste-images');

CREATE POLICY "Anyone can upload waste images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'waste-images');

-- Waste submissions table
CREATE TABLE public.waste_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  image_url TEXT NOT NULL,
  packaging_type TEXT,
  material_type TEXT,
  recyclability TEXT,
  disposal_instructions TEXT,
  detected_objects JSONB,
  ai_confidence NUMERIC,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT NOT NULL DEFAULT 'clean',
  pickup_required BOOLEAN NOT NULL DEFAULT true,
  address TEXT,
  pickup_time_slot TEXT,
  notes TEXT,
  reward_points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waste_submissions ENABLE ROW LEVEL SECURITY;

-- Demo-friendly policies (no auth required)
CREATE POLICY "Anyone can view submissions"
ON public.waste_submissions FOR SELECT
USING (true);

CREATE POLICY "Anyone can create submissions"
ON public.waste_submissions FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_waste_submissions_created_at ON public.waste_submissions(created_at DESC);
