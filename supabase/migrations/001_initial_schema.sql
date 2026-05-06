-- =============================================
-- RideShare Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- ── PROFILES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL DEFAULT '',
  email                 TEXT NOT NULL DEFAULT '',
  phone                 TEXT NOT NULL DEFAULT '',
  avatar_url            TEXT,
  rating                FLOAT DEFAULT 0,
  total_rides_driver    INT DEFAULT 0,
  total_rides_passenger INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── RIDES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rides (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source           TEXT NOT NULL,
  destination      TEXT NOT NULL,
  ride_date        DATE NOT NULL,
  ride_time        TIME NOT NULL,
  seats_total      INT NOT NULL DEFAULT 1,
  seats_available  INT NOT NULL DEFAULT 1,
  price_per_seat   INT,
  notes            TEXT,
  status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active rides are viewable by everyone"
  ON public.rides FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert rides"
  ON public.rides FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own rides"
  ON public.rides FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete their own rides"
  ON public.rides FOR DELETE USING (auth.uid() = driver_id);

-- ── RIDE REQUESTS ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.ride_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id      UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ride_id, passenger_id)
);

ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Passengers can see their own requests"
  ON public.ride_requests FOR SELECT
  USING (
    auth.uid() = passenger_id OR
    auth.uid() IN (SELECT driver_id FROM public.rides WHERE id = ride_id)
  );

CREATE POLICY "Authenticated users can insert ride requests"
  ON public.ride_requests FOR INSERT WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Drivers can update request status"
  ON public.ride_requests FOR UPDATE
  USING (
    auth.uid() IN (SELECT driver_id FROM public.rides WHERE id = ride_id)
    OR auth.uid() = passenger_id
  );

-- ── RATINGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id    UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  rater_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ratee_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stars      INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ride_id, rater_id, ratee_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON public.ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ratings"
  ON public.ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- ── TRIGGER: Auto-create profile on signup ────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── FUNCTION: Recalculate average rating ─────
CREATE OR REPLACE FUNCTION public.recalculate_rating(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET rating = (
    SELECT COALESCE(AVG(stars), 0)
    FROM public.ratings
    WHERE ratee_id = user_id
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── STORAGE: Enable avatars bucket ────────────
-- Run in Supabase Dashboard → Storage → Create bucket "avatars" (public)
-- Or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
