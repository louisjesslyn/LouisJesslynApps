-- ============================================
-- Louis & Jesslyn - Romantic Website Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Table: memories (kenangan di tiap lokasi)
CREATE TABLE IF NOT EXISTS memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location_name TEXT NOT NULL,
  emoji TEXT DEFAULT '💜',
  photos TEXT[], -- array of public URLs
  category TEXT DEFAULT 'moment', -- 'first_date', 'anniversary', 'trip', 'moment', 'special'
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: love_letters (surat cinta)
CREATE TABLE IF NOT EXISTS love_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_name TEXT NOT NULL,
  is_revealed BOOLEAN DEFAULT FALSE,
  reveal_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: bucket_list (hal yang ingin dilakukan bersama)
CREATE TABLE IF NOT EXISTS bucket_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dream TEXT NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  done_date DATE,
  emoji TEXT DEFAULT '🌟',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: milestones (pencapaian hubungan)
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  emoji TEXT DEFAULT '💜',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (baca publik, tulis harus auth)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa baca (read public)
CREATE POLICY "allow_read_memories" ON memories FOR SELECT USING (true);
CREATE POLICY "allow_read_love_letters" ON love_letters FOR SELECT USING (true);
CREATE POLICY "allow_read_bucket_list" ON bucket_list FOR SELECT USING (true);
CREATE POLICY "allow_read_milestones" ON milestones FOR SELECT USING (true);

-- Policy: hanya authenticated yang bisa write
CREATE POLICY "allow_write_memories" ON memories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_write_love_letters" ON love_letters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_write_bucket_list" ON bucket_list FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_write_milestones" ON milestones FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data - Milestones
INSERT INTO milestones (title, description, date, emoji) VALUES
  ('Hari Jadian', 'Hari yang paling spesial, hari di mana kita resmi jadi sepasang kekasih', '2025-06-17', '💜'),
  ('Ulang Tahun Berdua', 'Kita punya ulang tahun yang sama! 5 Juli 2005', '2025-07-05', '🎂'),
  ('1 Bulan Bersama', 'Satu bulan penuh kebersamaan yang indah', '2025-07-17', '🌸');

-- Insert sample bucket list
INSERT INTO bucket_list (dream, emoji) VALUES
  ('Nonton bintang berdua di malam hari', '⭐'),
  ('Pergi ke Bali berdua', '🌴'),
  ('Masak bareng di dapur', '🍳'),
  ('Nonton sunrise bareng', '🌅'),
  ('Bikin scrapbook kenangan berdua', '📸'),
  ('Road trip keliling Jawa', '🚗'),
  ('Belajar dance bareng', '💃'),
  ('Piknik di taman', '🧺');
