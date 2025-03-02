-- Create inmates table
CREATE TABLE IF NOT EXISTS inmates (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  county TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counties table
CREATE TABLE IF NOT EXISTS counties (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  wcca_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on county for faster queries
CREATE INDEX IF NOT EXISTS idx_county ON inmates (county);

-- Enable Row Level Security
ALTER TABLE inmates ENABLE ROW LEVEL SECURITY;
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access"
  ON inmates FOR SELECT
  USING (true);

CREATE POLICY "Public read access for counties"
  ON counties FOR SELECT
  USING (true);

-- Create policy for authenticated insert/update
CREATE POLICY "Authenticated insert/update access"
  ON inmates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update access"
  ON inmates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated insert/update access for counties"
  ON counties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update access for counties"
  ON counties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true); 