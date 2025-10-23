# Hướng dẫn cấu hình

## 1. Biến môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key

# API Configuration  
VITE_API_URL=your_phat_nguoi_api_url
```

## 2. Cấu hình Supabase

1. Tạo project mới trên [Supabase](https://supabase.com)
2. Vào Settings > API để lấy URL và anon key
3. Chạy SQL trong file `supabase_schema.sql` để tạo bảng

## 3. Cấu hình API

Thay `your_phat_nguoi_api_url` bằng URL API thực tế của bạn.

## 4. Chạy ứng dụng

```bash
npm install
npm run dev
```

## 5. Kiểm tra

1. Mở ứng dụng trong trình duyệt
2. Thử tra cứu một biển số
3. Kiểm tra lịch sử trong trang History
4. Xem dữ liệu trong Supabase Dashboard

# Cấu hình Supabase cho ứng dụng Phạt nguội

## 1. Tạo bảng trong Supabase

Chạy SQL sau trong Supabase SQL Editor:

```sql
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
```

## 2. Cấu trúc bảng

### Bảng `search_history`

| Cột | Kiểu dữ liệu | Mô tả |
|-----|-------------|-------|
| `id` | UUID | Khóa chính, tự động tạo |
| `plate` | VARCHAR(20) | Biển số xe |
| `vehicle_type` | VARCHAR(10) | Loại phương tiện ('oto' hoặc 'xemay') |
| `search_time` | TIMESTAMP | Thời gian tra cứu |
| `api_response` | JSONB | Toàn bộ response từ API phạt nguội |
| `created_at` | TIMESTAMP | Thời gian tạo record |
| `updated_at` | TIMESTAMP | Thời gian cập nhật cuối |

## 3. Cấu hình biến môi trường

Thêm vào file `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_API_URL=your_phat_nguoi_api_url
```

## 4. RLS (Row Level Security) - Tùy chọn

Nếu muốn bật RLS để kiểm soát quyền truy cập:

```sql
-- Bật RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả user đọc và ghi
CREATE POLICY "Allow all operations on search_history" ON search_history
    FOR ALL USING (true) WITH CHECK (true);
```

## 5. Kiểm tra

Sau khi tạo bảng, bạn có thể kiểm tra bằng cách:

1. Vào Supabase Dashboard > Table Editor
2. Xem bảng `search_history` đã được tạo
3. Test thêm một record mẫu nếu cần
