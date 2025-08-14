-- Create table for benefits
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  eligibility_status TEXT CHECK (eligibility_status IN ('ELIGIBLE', 'MAYBE', 'INELIGIBLE')) DEFAULT 'MAYBE',
  categories TEXT[] DEFAULT '{}',
  apply_deadline DATE,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  venue_name TEXT,
  venue_address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL,
  eligibility_status TEXT CHECK (eligibility_status IN ('ELIGIBLE', 'MAYBE', 'INELIGIBLE')) DEFAULT 'ELIGIBLE',
  categories TEXT[] DEFAULT '{}',
  organizer TEXT,
  registration_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is public information)
CREATE POLICY "Benefits are viewable by everyone" 
ON public.benefits 
FOR SELECT 
USING (true);

CREATE POLICY "Events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_benefits_updated_at
BEFORE UPDATE ON public.benefits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample benefits data
INSERT INTO public.benefits (title, summary, description, eligibility_status, categories, apply_deadline, source_url) VALUES
('Pioneer Generation Benefits', 'Healthcare subsidies and CHAS support for seniors.', 'Comprehensive healthcare benefits including subsidized medical treatments, dental care, and health screenings for Pioneer Generation members.', 'MAYBE', '{"healthcare", "subsidies"}', '2024-12-31', 'https://www.pioneergeneration.gov.sg'),
('Silver Support Scheme', 'Monthly cash support for elderly with limited income.', 'Quarterly cash payouts to supplement income for elderly Singaporeans aged 65 and above with limited means.', 'ELIGIBLE', '{"financial", "support"}', '2024-06-30', 'https://www.cpf.gov.sg/silver-support'),
('Seniors Mobility Fund', 'Subsidies for mobility aids and home modifications.', 'Financial assistance for purchasing mobility aids like wheelchairs, walking frames, and home safety modifications.', 'MAYBE', '{"mobility", "healthcare"}', null, 'https://www.aic.sg/financial-assistance'),
('Community Health Assist Scheme (CHAS)', 'Subsidized healthcare at participating clinics.', 'Receive subsidies for medical and dental care at CHAS GP clinics and dental clinics island-wide.', 'ELIGIBLE', '{"healthcare", "subsidies"}', null, 'https://www.chas.sg'),
('GST Voucher Scheme', 'Annual cash vouchers to offset GST impact.', 'Annual cash vouchers and utility rebates to help with daily expenses and offset the impact of GST.', 'ELIGIBLE', '{"financial", "vouchers"}', '2024-09-30', 'https://www.gstvoucher.gov.sg');

-- Insert sample events data
INSERT INTO public.events (title, summary, description, event_date, venue_name, venue_address, latitude, longitude, distance_km, eligibility_status, categories, organizer, registration_url) VALUES
('Tai Chi @ Bishan Park', 'Gentle movement for balance and health.', 'Join our weekly Tai Chi sessions suitable for all fitness levels. Learn traditional forms while improving balance, flexibility, and mental well-being.', '2024-08-16 08:00:00+08', 'Bishan Park', '1387 Ang Mo Kio Ave 1', 1.3520, 103.8466, 2.1, 'ELIGIBLE', '{"fitness", "outdoor"}', 'Bishan Community Club', 'https://www.onepa.gov.sg/bishan'),
('Hawker Trail: Toa Payoh', 'Discover heritage hawker gems with the community.', 'Guided food tour through Toa Payoh''s historic hawker centers. Learn about local food heritage while enjoying delicious traditional dishes.', '2024-08-17 10:00:00+08', 'Toa Payoh Central', 'Toa Payoh Central', 1.3329, 103.8503, 4.5, 'ELIGIBLE', '{"food", "heritage"}', 'Toa Payoh Heritage Society', 'https://www.tphs.org.sg'),
('Digital Banking Workshop', 'Learn to use banking apps safely and confidently.', 'Hands-on workshop to learn digital banking, online payments, and cybersecurity tips. Smartphones provided for practice.', '2024-08-18 14:00:00+08', 'Ang Mo Kio Library', '4300 Ang Mo Kio Ave 6', 1.3692, 103.8454, 1.8, 'ELIGIBLE', '{"education", "technology"}', 'National Library Board', 'https://www.nlb.gov.sg/golibrary'),
('Community Garden @ Jurong', 'Learn organic gardening with neighbors.', 'Weekly community gardening sessions. Learn to grow your own vegetables and herbs while connecting with fellow gardening enthusiasts.', '2024-08-19 16:00:00+08', 'Jurong Community Garden', 'Jurong West St 52', 1.3496, 103.7065, 8.2, 'ELIGIBLE', '{"gardening", "community"}', 'Jurong West Community Club', 'https://www.onepa.gov.sg/jurong-west'),
('Health Screening @ Tampines', 'Free health checks and consultations.', 'Comprehensive health screening including blood pressure, cholesterol, diabetes checks, and consultations with healthcare professionals.', '2024-08-20 09:00:00+08', 'Tampines Hub', '1 Tampines Walk', 1.3525, 103.9447, 12.5, 'ELIGIBLE', '{"healthcare", "screening"}', 'Health Promotion Board', 'https://www.hpb.gov.sg'),
('Silver Screen Cinema', 'Classic movie screening with discussion.', 'Enjoy classic Singaporean and international films followed by tea and discussion. This month featuring "Crazy Rich Asians".', '2024-08-21 14:30:00+08', 'Esplanade Theatre', '1 Esplanade Dr', 1.2897, 103.8556, 6.8, 'ELIGIBLE', '{"entertainment", "social"}', 'Esplanade - Theatres on the Bay', 'https://www.esplanade.com'),
('Line Dancing Class', 'Fun exercise through dance for all levels.', 'Beginner-friendly line dancing classes. No partner needed! Great for cardio, coordination, and making new friends.', '2024-08-22 10:00:00+08', 'Bedok Community Centre', '850 New Upper Changi Rd', 1.3244, 103.9356, 15.2, 'ELIGIBLE', '{"fitness", "dance"}', 'Bedok Community Centre', 'https://www.onepa.gov.sg/bedok'),
('Cooking Class: Peranakan Cuisine', 'Learn traditional Peranakan cooking techniques.', 'Master the art of Peranakan cuisine with hands-on cooking class. Learn to prepare ayam buah keluak and kueh pie tee.', '2024-08-23 11:00:00+08', 'Katong Community Centre', '845 Mountbatten Rd', 1.3048, 103.9018, 11.3, 'MAYBE', '{"cooking", "culture"}', 'Katong Community Centre', 'https://www.onepa.gov.sg/katong'),
('Smart Home Technology Demo', 'Explore tech solutions for aging in place.', 'Interactive demo of smart home devices that can help seniors live independently and safely. Learn about voice assistants, smart lighting, and health monitors.', '2024-08-24 15:00:00+08', 'Science Centre Singapore', '15 Science Centre Rd', 1.3336, 103.7366, 9.1, 'ELIGIBLE', '{"technology", "education"}', 'IMDA Digital for Life', 'https://www.imda.gov.sg/digitalforlife'),
('Heritage Walk: Chinatown', 'Guided tour of historic Chinatown landmarks.', 'Discover the rich history of Chinatown through a guided walking tour. Visit temples, traditional shops, and hear stories of early immigrant life.', '2024-08-25 16:30:00+08', 'Chinatown Heritage Centre', '48 Pagoda St', 1.2834, 103.8443, 5.9, 'ELIGIBLE', '{"heritage", "walking"}', 'Singapore Heritage Society', 'https://www.singaporeheritage.org');