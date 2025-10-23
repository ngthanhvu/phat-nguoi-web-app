-- Tạo bảng lưu lịch sử tra cứu phạt nguội
CREATE TABLE search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plate VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(10) NOT NULL CHECK (vehicle_type IN ('oto', 'xemay')),
    search_time TIMESTAMP WITH TIME ZONE NOT NULL,
    api_response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX idx_search_history_plate ON search_history(plate);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX idx_search_history_vehicle_type ON search_history(vehicle_type);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_search_history_updated_at 
    BEFORE UPDATE ON search_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tạo RLS (Row Level Security) policies nếu cần
-- ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả user đọc và ghi (tùy chỉnh theo nhu cầu)
CREATE POLICY "Allow all operations on search_history" ON search_history
    FOR ALL USING (true) WITH CHECK (true);
