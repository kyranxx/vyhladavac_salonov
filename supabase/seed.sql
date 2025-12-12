// Sample data for salons
// Run this in Supabase SQL Editor after initial_schema migration

-- Insert sample salons
INSERT INTO salons (id, owner_id, name, slug, description, address, city, district_id, postal_code, phone, email, website, latitude, longitude, status, is_premium, is_verified, is_featured) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'Beauty Salon Bratislava', 'beauty-salon-bratislava', 'Profesionálny salón krásy v centre Bratislavy. Ponúkame komplexné služby v oblasti kaderníctva, kozmetiky a manikúry. Náš tím skúsených odborníkov sa postará o váš dokonalý vzhľad.', 'Obchodná 25', 'Bratislava', 1, '811 06', '+421 900 123 456', 'info@beautysalon.sk', 'https://beautysalon.sk', 48.1486, 17.1077, 'approved', true, true, true),

('22222222-2222-2222-2222-222222222222', NULL, 'Nail Studio Košice', 'nail-studio-kosice', 'Špecializujeme sa na gélové nechty, manikúru a pedikúru. Používame len kvalitné materiály od popredných výrobcov.', 'Hlavná 89', 'Košice', 2, '040 01', '+421 901 234 567', 'info@nailstudio.sk', NULL, 48.7164, 21.2611, 'approved', true, true, false),

('33333333-3333-3333-3333-333333333333', NULL, 'Wellness & Spa Žilina', 'wellness-spa-zilina', 'Relaxačné centrum s masážami, saunou a wellness procedúrami. Darujte si oddych a regeneráciu v príjemnom prostredí.', 'Mariánske námestie 5', 'Žilina', 3, '010 01', '+421 902 345 678', 'relax@wellnesszilina.sk', 'https://wellnesszilina.sk', 49.2231, 18.7394, 'approved', false, true, false),

('44444444-4444-4444-4444-444444444444', NULL, 'Gentleman Barbershop Nitra', 'gentleman-barbershop-nitra', 'Tradičný barbershop pre pánov. Strihanie, holenie, úprava brady v štýlovom prostredí.', 'Štefánikova 15', 'Nitra', 4, '949 01', '+421 903 456 789', 'barber@gentlemanni.sk', NULL, 48.3069, 18.0894, 'approved', true, false, false),

('55555555-5555-5555-5555-555555555555', NULL, 'Studio Kozmetika Prešov', 'studio-kozmetika-presov', 'Profesionálna starostlivosť o pleť, ošetrenia tváre a tela. Moderné prístroje a kvalifikovaný personál.', 'Jarková 23', 'Prešov', 5, '080 01', '+421 904 567 890', 'kozmetika@studiopresov.sk', NULL, 48.9983, 21.2394, 'approved', false, false, false),

('66666666-6666-6666-6666-666666666666', NULL, 'Hair Design Trnava', 'hair-design-trnava', 'Moderné kaderníctvo s najnovšími trendami. Strihanie, farbenie, styling pre dámy aj pánov.', 'Hlavná 67', 'Trnava', 6, '917 01', '+421 905 678 901', 'hair@designtrnava.sk', 'https://hairdesigntrnava.sk', 48.3774, 17.5883, 'approved', false, false, false),

('77777777-7777-7777-7777-777777777777', NULL, 'Masáže Trenčín', 'masaze-trencin', 'Relaxačné a liečebné masáže. Thajská masáž, klasická masáž, aromaterapia.', 'Mierové námestie 8', 'Trenčín', 7, '911 01', '+421 906 789 012', 'masaze@trencin.sk', NULL, 48.8945, 18.0444, 'approved', false, true, false),

('88888888-8888-8888-8888-888888888888', NULL, 'Tetovanie Art Studio', 'tetovanie-art-studio', 'Profesionálne tetovanie a piercing. Vlastné návrhy, cover-up, všetky štýly.', 'SNP 45', 'Banská Bystrica', 8, '974 01', '+421 907 890 123', 'info@tattoobb.sk', 'https://tattoobb.sk', 48.7360, 19.1461, 'approved', true, true, true);

-- Insert salon categories (many-to-many relationships)
INSERT INTO salon_categories (salon_id, category_id) VALUES
('11111111-1111-1111-1111-111111111111', 1),
('11111111-1111-1111-1111-111111111111', 5),
('11111111-1111-1111-1111-111111111111', 6),
('22222222-2222-2222-2222-222222222222', 6),
('22222222-2222-2222-2222-222222222222', 7),
('33333333-3333-3333-3333-333333333333', 9),
('33333333-3333-3333-3333-333333333333', 17),
('44444444-4444-4444-4444-444444444444', 4),
('44444444-4444-4444-4444-444444444444', 2),
('55555555-5555-5555-5555-555555555555', 5),
('55555555-5555-5555-5555-555555555555', 10),
('66666666-6666-6666-6666-666666666666', 1),
('66666666-6666-6666-6666-666666666666', 2),
('77777777-7777-7777-7777-777777777777', 9),
('88888888-8888-8888-8888-888888888888', 13);

-- Insert opening hours for salons
INSERT INTO opening_hours (salon_id, day_of_week, open_time, close_time, is_closed) VALUES
-- Beauty Salon Bratislava
('11111111-1111-1111-1111-111111111111', 0, '09:00', '20:00', false),
('11111111-1111-1111-1111-111111111111', 1, '09:00', '20:00', false),
('11111111-1111-1111-1111-111111111111', 2, '09:00', '20:00', false),
('11111111-1111-1111-1111-111111111111', 3, '09:00', '20:00', false),
('11111111-1111-1111-1111-111111111111', 4, '09:00', '20:00', false),
('11111111-1111-1111-1111-111111111111', 5, '10:00', '16:00', false),
('11111111-1111-1111-1111-111111111111', 6, NULL, NULL, true);

-- Insert services for salons
INSERT INTO services (salon_id, name_sk, name_en, price, duration_minutes, is_approved) VALUES
('11111111-1111-1111-1111-111111111111', 'Dámsky strih', 'Women haircut', 25.00, 45, true),
('11111111-1111-1111-1111-111111111111', 'Pánsky strih', 'Men haircut', 15.00, 30, true),
('11111111-1111-1111-1111-111111111111', 'Farbenie', 'Coloring', 50.00, 120, true),
('11111111-1111-1111-1111-111111111111', 'Manikúra klasická', 'Classic manicure', 20.00, 45, true),
('11111111-1111-1111-1111-111111111111', 'Gélové nechty', 'Gel nails', 35.00, 90, true),
('22222222-2222-2222-2222-222222222222', 'Gélové nechty', 'Gel nails', 40.00, 90, true),
('22222222-2222-2222-2222-222222222222', 'Manikúra klasická', 'Classic manicure', 18.00, 40, true),
('22222222-2222-2222-2222-222222222222', 'Pedikúra', 'Pedicure', 25.00, 60, true),
('33333333-3333-3333-3333-333333333333', 'Klasická masáž', 'Classic massage', 30.00, 60, true),
('33333333-3333-3333-3333-333333333333', 'Thajská masáž', 'Thai massage', 45.00, 90, true),
('44444444-4444-4444-4444-444444444444', 'Pánsky strih', 'Men haircut', 18.00, 30, true),
('44444444-4444-4444-4444-444444444444', 'Holenie britvou', 'Straight razor shave', 15.00, 30, true);
