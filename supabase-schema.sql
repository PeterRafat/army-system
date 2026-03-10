-- ========================================
-- Military Personnel Recommendation System
-- Supabase Database Schema
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: soldiers
-- ========================================
CREATE TABLE IF NOT EXISTS soldiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number TEXT NOT NULL,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    police_number TEXT NOT NULL,
    governorate TEXT NOT NULL,
    qualification TEXT NOT NULL,
    current_unit TEXT NOT NULL,
    batch TEXT NOT NULL,
    assigned_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster search on normalized_name and police_number
CREATE INDEX idx_soldiers_normalized_name ON soldiers(normalized_name);
CREATE INDEX idx_soldiers_police_number ON soldiers(police_number);
CREATE INDEX idx_soldiers_name ON soldiers(name);

-- ========================================
-- Table: recommendations
-- ========================================
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soldier_id UUID NOT NULL REFERENCES soldiers(id) ON DELETE CASCADE,
    recommended_to TEXT NOT NULL,
    recommended_by TEXT NOT NULL,
    target_unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookup by soldier_id
CREATE INDEX idx_recommendations_soldier_id ON recommendations(soldier_id);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at DESC);

-- ========================================
-- Row Level Security (RLS) Policies
-- Note: For development, we're allowing all operations
-- In production, you should implement proper authentication
-- ========================================

-- Enable RLS
ALTER TABLE soldiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for soldiers table
CREATE POLICY "Allow all operations on soldiers" 
ON soldiers FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for recommendations table
CREATE POLICY "Allow all operations on recommendations" 
ON recommendations FOR ALL 
USING (true) 
WITH CHECK (true);

-- ========================================
-- Sample Data Insertion Script
-- ========================================

-- Insert sample soldiers with Arabic names
INSERT INTO soldiers (serial_number, name, normalized_name, police_number, governorate, qualification, current_unit, batch, assigned_date) VALUES
('SN001', 'أحمد محمد محمود', 'احمد محمد محمود', 'POL-2024-001', 'القاهرة', 'بكالوريوس علوم عسكرية', 'اللواء الأول', 'دفعة 2020', '2020-09-01'),
('SN002', 'محمد إبراهيم حسن', 'محمد ابراهيم حسن', 'POL-2024-002', 'الإسكندرية', 'بكالوريوس شرطة', 'إدارة المرور', 'دفعة 2021', '2021-03-15'),
('SN003', 'محمود علي عبدالله', 'محمود علي عبدالله', 'POL-2024-003', 'الجيزة', 'ماجستير إدارة أعمال', 'الأمن الوطني', 'دفعة 2019', '2019-06-20'),
('SN004', 'خالد سعيد عبدالرحمن', 'خالد سعيد عبدالرحمن', 'POL-2024-004', 'الشرقية', 'بكالوريوس حقوق', 'نيابة الأموال العامة', 'دفعة 2018', '2018-01-10'),
('SN005', 'إبراهيم مصطفى كمال', 'ابراهيم مصطفي كمال', 'POL-2024-005', 'الدقهلية', 'بكالوريوس تجارة', 'الجهاز المركزي', 'دفعة 2022', '2022-07-05'),
('SN006', 'عمر فاروق عثمان', 'عمر فاروق عثمان', 'POL-2024-006', 'الغربية', 'بكالوريوس هندسة', 'قسم الأشغال', 'دفعة 2020', '2020-11-12'),
('SN007', 'ياسر حمدي زكي', 'ياسر حمدي زكي', 'POL-2024-007', 'القليوبية', 'بكالوريوس إعلام', 'العلاقات العامة', 'دفعة 2021', '2021-02-28'),
('SN008', 'هشام نبيل فوزي', 'هشام نبيل فوزي', 'POL-2024-008', 'بحيرة', 'بكالوريوس زراعة', 'الإدارة الزراعية', 'دفعة 2019', '2019-08-17'),
('SN009', 'طارق عادل إمام', 'طارق عادل امام', 'POL-2024-009', 'كفر الشيخ', 'بكالوريوس تربية رياضية', 'اللياقة البدنية', 'دفعة 2022', '2022-04-22'),
('SN010', 'سامح جلال مرعي', 'سامح جلال مرعي', 'POL-2024-010', 'المنوفية', 'بكالوريوس حاسبات', 'تكنولوجيا المعلومات', 'دفعة 2023', '2023-01-08');

-- Insert sample recommendations
INSERT INTO recommendations (soldier_id, recommended_to, recommended_by, target_unit) VALUES
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-001'), 'اللواء أحمد حسن', 'العقيد محمد عبداللطيف', 'اللواء الثاني المدرع'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-001'), 'اللواء محمود كامل', 'العقيد أحمد زاهر', 'قيادة القوات الخاصة'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-002'), 'اللواء إبراهيم العصار', 'العقيد سامح عبدالسلام', 'إدارة مكافحة المخدرات'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-003'), 'اللواء خالد طه', 'العقيد ياسر فتحي', 'جهاز المخابرات'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-004'), 'اللواء عادل الجندي', 'العقيد هشام بركة', 'نيابة الاستئناف'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-005'), 'اللواء منير ثابت', 'العقيد طارق العناني', 'هيئة الرقابة الإدارية'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-006'), 'اللواء وحيد عبدالرازق', 'العقيد عمر الشافعي', 'قطاع الطرق والكباري'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-007'), 'اللواء سيد الضبع', 'العقيد نبيل حجازي', 'الإعلام الأمني'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-008'), 'اللواء كمال الدسوقي', 'العقيد علاء عزت', 'حماية البيئة'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-009'), 'اللواء أحمد رشدي', 'العقيد جلال النجار', 'أكاديمية الشرطة'),
((SELECT id FROM soldiers WHERE police_number = 'POL-2024-010'), 'اللواء فؤاد علام', 'العقيد مجدي أبو الغيط', 'الإدارة العامة للحراسات');

-- Verify data insertion
SELECT COUNT(*) as total_soldiers FROM soldiers;
SELECT COUNT(*) as total_recommendations FROM recommendations;
