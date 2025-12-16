-- =====================================================
-- TEST DATA FOR SALON FINDER SK
-- Delete this data before production launch
-- =====================================================

-- Insert test categories first (if not exist)
INSERT INTO categories (slug, name_sk, name_en, name_hu, icon, is_active, sort_order)
VALUES 
    ('kadernicky-salon', 'Kadernícky salón', 'Hair Salon', 'Fodrászat', '💇', true, 1),
    ('kozmeticky-salon', 'Kozmetický salón', 'Beauty Salon', 'Szépségszalon', '💄', true, 2),
    ('manikura', 'Manikúra & Pedikúra', 'Nail Salon', 'Manikűr', '💅', true, 3),
    ('masaze', 'Masáže', 'Massage', 'Masszázs', '💆', true, 4),
    ('barbershop', 'Barbershop', 'Barbershop', 'Barbershop', '✂️', true, 5),
    ('wellness', 'Wellness & Spa', 'Wellness & Spa', 'Wellness & Spa', '🧖', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Create a test owner profile (use your actual user ID or create mock)
-- You'll need to replace 'your-user-id' with an actual UUID from auth.users

-- Insert 20 test salons across Slovakia
INSERT INTO salons (
    name, slug, description_sk, address, city, postal_code, 
    phone, email, website, status, tier, owner_id
) VALUES 
-- BRATISLAVA (6 salons)
(
    'Hair Studio Bratislava', 
    'hair-studio-bratislava',
    'Moderný kadernícky salón v srdci Bratislavy. Špecializujeme sa na dámske aj pánske strihy, farbenie a regeneráciu vlasov. Náš tím skúsených stylistov používa len prémiové produkty.',
    'Obchodná 42',
    'Bratislava',
    '81101',
    '+421 902 123 456',
    'info@hairstudioba.sk',
    'https://hairstudioba.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Krása & Štýl Kozmetika',
    'krasa-styl-kozmetika',
    'Luxusný kozmetický salón ponúkajúci kompletné ošetrenia pleti, make-up a relaxačné procedúry. Certifikované kozmetičky s dlhoročnou praxou.',
    'Laurinská 15',
    'Bratislava',
    '81101',
    '+421 903 234 567',
    'rezervacie@krasastyl.sk',
    NULL,
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Nail Art Studio',
    'nail-art-studio-ba',
    'Profesionálna manikúra a pedikúra. Gelové nechty, akrylové nechty, nail art. Používame sterilné nástroje a prémiové materiály.',
    'Mickiewiczova 8',
    'Bratislava',
    '81107',
    '+421 910 345 678',
    'nailart@studio.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Gentleman Barbershop',
    'gentleman-barbershop-ba',
    'Klasický pánskym barbershop. Strihy, holenie, úprava brady. Prémiový zážitok pre moderných gentlemanov.',
    'Ventúrska 3',
    'Bratislava',
    '81101',
    '+421 904 456 789',
    NULL,
    'https://gentleman.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Thai Massage Centrum',
    'thai-massage-centrum',
    'Autentické thajské masáže od certifikovaných masériek z Thajska. Tradičná thajská masáž, aromaterapia, reflexná masáž chodidiel.',
    'Staromestská 12',
    'Bratislava',
    '81103',
    '+421 905 567 890',
    'rezervacie@thaimassage.sk',
    'https://thaimassage.sk',
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Wellness Oáza',
    'wellness-oaza-ba',
    'Kompletné wellness centrum so saunami, vírivkami a masážami. Relax a oddych v centre mesta.',
    'Panská 28',
    'Bratislava',
    '81101',
    '+421 906 678 901',
    'info@wellnessoaza.sk',
    'https://wellnessoaza.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),

-- KOŠICE (4 salons)
(
    'Glamour Hair Košice',
    'glamour-hair-kosice',
    'Prémiový kadernícky salón v Košiciach. Trendy účesy, profesionálne farbenie, keratínové ošetrenia.',
    'Hlavná 85',
    'Košice',
    '04001',
    '+421 907 789 012',
    'glamour@hair.sk',
    NULL,
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Beauty Queen Salon',
    'beauty-queen-salon',
    'Kozmetický salón s komplexnou starostlivosťou o pleť. Lifting, mezoterapia, permanentný make-up.',
    'Mlynská 22',
    'Košice',
    '04001',
    '+421 908 890 123',
    'beautyqueen@salon.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Nechty Express',
    'nechty-express-ke',
    'Rýchla a kvalitná manikúra bez čakania. Gélové nechty hotové za 45 minút.',
    'Štúrova 10',
    'Košice',
    '04001',
    '+421 909 901 234',
    NULL,
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Barber King Košice',
    'barber-king-kosice',
    'Najlepší barbershop v Košiciach. Klasické strihy, úprava brady, hot towel shave.',
    'Alžbetina 34',
    'Košice',
    '04001',
    '+421 910 012 345',
    'king@barber.sk',
    'https://barberking.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),

-- ŽILINA (3 salons)
(
    'Hair Design Žilina',
    'hair-design-zilina',
    'Moderný salón s mladým tímom stylistov. Balayage, ombre, kreatívne farbenie.',
    'Národná 12',
    'Žilina',
    '01001',
    '+421 911 123 456',
    'hairdesign@za.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Relax Masáže Žilina',
    'relax-masaze-zilina',
    'Športové masáže, relaxačné masáže, manuálna lymfodrenáž. Profesionálni fyzioterapeuti.',
    'Hurbanova 5',
    'Žilina',
    '01001',
    '+421 912 234 567',
    'relax@masaze.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Spa & Wellness Žilina',
    'spa-wellness-zilina',
    'Luxusné wellness centrum s bazénom, saunami a masážami. Denné vstupy aj permanentky.',
    'Partizánska 18',
    'Žilina',
    '01001',
    '+421 913 345 678',
    'spa@wellness-za.sk',
    'https://wellness-za.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),

-- NITRA (2 salons)
(
    'Elegance Kaderníctvo',
    'elegance-kadernictvo-nr',
    'Elegantný salón pre náročnú klientelu. Svadobné účesy, spoločenské účesy, predlžovanie vlasov.',
    'Štefánikova 8',
    'Nitra',
    '94901',
    '+421 914 456 789',
    'elegance@hair.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Kozmetika Nitra Centrum',
    'kozmetika-nitra-centrum',
    'Profesionálna kozmetika a permanentný make-up. Mikropigmentácia obočia, očné linky.',
    'Farská 3',
    'Nitra',
    '94901',
    '+421 915 567 890',
    'kozmetika@nitra.sk',
    NULL,
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),

-- PREŠOV (2 salons)
(
    'Top Hair Prešov',
    'top-hair-presov',
    'Dynamický kadernícky salón s najnovšími trendmi. Olaplex ošetrenia, blond špeciality.',
    'Hlavná 52',
    'Prešov',
    '08001',
    '+421 916 678 901',
    'tophair@presov.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Nails & More Prešov',
    'nails-more-presov',
    'Kompletná starostlivosť o nechty. Gélové nechty, french, zdobenie, pedikúra.',
    'Masarykova 15',
    'Prešov',
    '08001',
    '+421 917 789 012',
    NULL,
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),

-- BANSKÁ BYSTRICA (2 salons)
(
    'Studio Krása BB',
    'studio-krasa-bb',
    'Multifunkčný salón krásy. Kaderníctvo, kozmetika, manikúra pod jednou strechou.',
    'Námestie SNP 18',
    'Banská Bystrica',
    '97401',
    '+421 918 890 123',
    'studio@krasabb.sk',
    'https://krasabb.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Barber Brothers BB',
    'barber-brothers-bb',
    'Bratia barberi s vášňou pre remeslo. Fade strihy, vintage holenie, úprava brady.',
    'Horná 25',
    'Banská Bystrica',
    '97401',
    '+421 919 901 234',
    'brothers@barber.sk',
    NULL,
    'approved',
    'free',
    (SELECT id FROM auth.users LIMIT 1)
),

-- TRNAVA (1 salon)
(
    'Salon Luxe Trnava',
    'salon-luxe-trnava',
    'Luxusný salón pre všetky služby krásy. VIP priestory, súkromie, najvyššia kvalita.',
    'Hlavná 33',
    'Trnava',
    '91701',
    '+421 920 012 345',
    'luxe@salon-tt.sk',
    'https://salon-tt.sk',
    'approved',
    'premium',
    (SELECT id FROM auth.users LIMIT 1)
);

-- Link salons to categories (salon_categories junction table)
-- Get the category IDs dynamically
INSERT INTO salon_categories (salon_id, category_id)
SELECT s.id, c.id
FROM salons s
CROSS JOIN categories c
WHERE 
    (s.name LIKE '%Hair%' AND c.slug = 'kadernicky-salon') OR
    (s.name LIKE '%Kaderníc%' AND c.slug = 'kadernicky-salon') OR
    (s.name LIKE '%Kozmetik%' AND c.slug = 'kozmeticky-salon') OR
    (s.name LIKE '%Beauty%' AND c.slug = 'kozmeticky-salon') OR
    (s.name LIKE '%Nail%' AND c.slug = 'manikura') OR
    (s.name LIKE '%Necht%' AND c.slug = 'manikura') OR
    (s.name LIKE '%Masáž%' AND c.slug = 'masaze') OR
    (s.name LIKE '%Massage%' AND c.slug = 'masaze') OR
    (s.name LIKE '%Barber%' AND c.slug = 'barbershop') OR
    (s.name LIKE '%Wellness%' AND c.slug = 'wellness') OR
    (s.name LIKE '%Spa%' AND c.slug = 'wellness') OR
    (s.name LIKE '%Studio Krása%' AND c.slug = 'kozmeticky-salon') OR
    (s.name LIKE '%Salon Luxe%' AND c.slug = 'kozmeticky-salon')
ON CONFLICT DO NOTHING;

-- Add some sample services for premium salons
INSERT INTO services (salon_id, name_sk, price, duration_minutes, category)
SELECT 
    s.id,
    service_name,
    service_price,
    service_duration,
    service_category
FROM salons s
CROSS JOIN (
    VALUES 
        ('Strih dámsky', 25, 45, 'hair'),
        ('Strih pánsky', 15, 30, 'hair'),
        ('Farbenie', 45, 90, 'hair'),
        ('Melír', 55, 120, 'hair'),
        ('Manikúra', 20, 45, 'nails'),
        ('Pedikúra', 30, 60, 'nails'),
        ('Gélové nechty', 40, 90, 'nails'),
        ('Relaxačná masáž', 35, 60, 'massage'),
        ('Športová masáž', 40, 60, 'massage'),
        ('Ošetrenie pleti', 50, 75, 'cosmetics')
) AS services(service_name, service_price, service_duration, service_category)
WHERE s.tier = 'premium'
LIMIT 50;

-- =====================================================
-- To DELETE all test data later, run:
-- DELETE FROM services WHERE salon_id IN (SELECT id FROM salons WHERE slug LIKE '%test%' OR created_at > '2024-12-16');
-- DELETE FROM salon_categories WHERE salon_id IN (SELECT id FROM salons WHERE slug LIKE '%test%' OR created_at > '2024-12-16');
-- DELETE FROM salons WHERE slug LIKE '%test%' OR created_at > '2024-12-16';
-- =====================================================
