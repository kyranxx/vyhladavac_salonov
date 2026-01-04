-- =========================================================
-- REGISTER SALÓNOV - TEST DATA
-- Run this AFTER the main database setup and after signing up
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- =========================================================

-- To find your user ID, run:
-- SELECT id, email FROM auth.users;

-- Replace this with your actual user ID from the query above
-- Example: DO $$ DECLARE user_id UUID := '12345678-1234-1234-1234-123456789abc'; BEGIN

DO $$
DECLARE
    user_id UUID;
    company1_id UUID;
    company2_id UUID;
    company3_id UUID;
BEGIN
    -- Get the first user (you should adjust this if needed)
    SELECT id INTO user_id FROM auth.users LIMIT 1;
    
    IF user_id IS NULL THEN
        RAISE NOTICE 'No users found. Please sign up first, then run this script.';
        RETURN;
    END IF;

    RAISE NOTICE 'Creating test data for user: %', user_id;

    -- =========================================================
    -- CREATE TEST COMPANIES
    -- =========================================================
    
    -- Company 1: Beauty Group s.r.o.
    INSERT INTO companies (owner_id, name, ico, dic, ic_dph, address, city, postal_code, email, phone, bank_account)
    VALUES (
        user_id,
        'Beauty Group s.r.o.',
        '12345678',
        '2012345678',
        'SK2012345678',
        'Hlavná 15',
        'Bratislava',
        '81101',
        'fakturacia@beautygroup.sk',
        '+421 900 111 222',
        'SK00 0000 0000 0000 0000 0001'
    ) RETURNING id INTO company1_id;

    -- Company 2: Salon Elegancia s.r.o.
    INSERT INTO companies (owner_id, name, ico, dic, address, city, postal_code, email, phone)
    VALUES (
        user_id,
        'Salon Elegancia s.r.o.',
        '87654321',
        '2087654321',
        'Námestie SNP 10',
        'Košice',
        '04001',
        'info@elegancia.sk',
        '+421 900 333 444'
    ) RETURNING id INTO company2_id;

    -- Company 3: Wellness & Spa s.r.o.
    INSERT INTO companies (owner_id, name, ico, dic, address, city, postal_code, email, phone)
    VALUES (
        user_id,
        'Wellness & Spa s.r.o.',
        '11223344',
        '2011223344',
        'Kúpeľná 5',
        'Piešťany',
        '92101',
        'rezervacie@wellnessspa.sk',
        '+421 900 555 666'
    ) RETURNING id INTO company3_id;

    RAISE NOTICE 'Created 3 test companies';

    -- =========================================================
    -- CREATE TEST SALONS
    -- =========================================================

    -- Salons for Company 1 (Beauty Group)
    INSERT INTO salons (owner_id, company_id, name, slug, city, address, phone, email, status, tier, description_sk)
    VALUES 
        (user_id, company1_id, 'Beauty Studio Bratislava', 'beauty-studio-bratislava', 'Bratislava', 'Obchodná 25', '+421 900 111 001', 'studio@beautygroup.sk', 'approved', 'premium', 'Profesionálne beauty služby v centre Bratislavy. Ponúkame kaderníctvo, kozmetiku a manikúru.'),
        (user_id, company1_id, 'Hair Paradise', 'hair-paradise-bratislava', 'Bratislava', 'Dunajská 8', '+421 900 111 002', 'hair@beautygroup.sk', 'approved', 'free', 'Moderné kaderníctvo so skúseným tímom stylistov.'),
        (user_id, company1_id, 'Nails & More', 'nails-and-more', 'Bratislava', 'Ventúrska 3', '+421 900 111 003', 'nails@beautygroup.sk', 'pending', 'free', 'Špecializovaný nechtový salón s gélovými a akrylovými nechtami.');

    -- Salons for Company 2 (Salon Elegancia)
    INSERT INTO salons (owner_id, company_id, name, slug, city, address, phone, email, status, tier, description_sk)
    VALUES 
        (user_id, company2_id, 'Elegancia Centrum', 'elegancia-centrum-kosice', 'Košice', 'Hlavná 50', '+421 900 333 001', 'centrum@elegancia.sk', 'approved', 'premium', 'Luxusný beauty salón v centre Košíc. Kozmetika, kaderníctvo, wellness.'),
        (user_id, company2_id, 'Elegancia Express', 'elegancia-express', 'Košice', 'Štúrova 12', '+421 900 333 002', 'express@elegancia.sk', 'approved', 'free', 'Rýchle beauty služby pre zaneprázdnených klientov.');

    -- Salons for Company 3 (Wellness & Spa)
    INSERT INTO salons (owner_id, company_id, name, slug, city, address, phone, email, status, tier, description_sk)
    VALUES 
        (user_id, company3_id, 'Relax Spa Piešťany', 'relax-spa-piestany', 'Piešťany', 'Kúpeľná 5', '+421 900 555 001', 'spa@wellnessspa.sk', 'approved', 'premium', 'Komplexné wellness a spa služby v kúpeľnom meste Piešťany. Masáže, sauny, bazény.'),
        (user_id, company3_id, 'Thai Massage Studio', 'thai-massage', 'Piešťany', 'Winterova 8', '+421 900 555 002', 'thai@wellnessspa.sk', 'pending', 'free', 'Autentické thajské masáže od certifikovaných masériek.');

    RAISE NOTICE 'Created 8 test salons';

    -- =========================================================
    -- LINK SALONS TO CATEGORIES
    -- =========================================================
    
    -- Get category IDs
    INSERT INTO salon_categories (salon_id, category_id, is_primary)
    SELECT s.id, c.id, true
    FROM salons s
    CROSS JOIN categories c
    WHERE 
        (s.slug = 'beauty-studio-bratislava' AND c.slug = 'kozmetika')
        OR (s.slug = 'hair-paradise-bratislava' AND c.slug = 'damske-kadernictvo')
        OR (s.slug = 'nails-and-more' AND c.slug = 'manikura')
        OR (s.slug = 'elegancia-centrum-kosice' AND c.slug = 'kozmetika')
        OR (s.slug = 'elegancia-express' AND c.slug = 'damske-kadernictvo')
        OR (s.slug = 'relax-spa-piestany' AND c.slug = 'wellness')
        OR (s.slug = 'thai-massage' AND c.slug = 'masaze');

    RAISE NOTICE 'Linked salons to categories';

    -- =========================================================
    -- CREATE TEST SERVICES
    -- =========================================================
    
    INSERT INTO services (salon_id, name, description, price, duration_minutes)
    SELECT s.id, service_name, service_desc, service_price, service_duration
    FROM salons s
    CROSS JOIN (VALUES
        ('Strih vlasov', 'Profesionálny strih dámskych alebo pánskych vlasov', 25.00, 45),
        ('Farbenie vlasov', 'Farbenie vlasov s kvalitnou farbou', 45.00, 90),
        ('Manikúra', 'Klasická manikúra s lakom', 18.00, 30),
        ('Pedikúra', 'Klasická pedikúra', 22.00, 45),
        ('Čistenie pleti', 'Hĺbkové čistenie pleti', 35.00, 60),
        ('Masáž tela', 'Relaxačná masáž celého tela', 40.00, 60)
    ) AS services(service_name, service_desc, service_price, service_duration)
    WHERE s.status = 'approved'
    LIMIT 30;

    RAISE NOTICE 'Created test services';
    RAISE NOTICE 'Test data creation complete!';

END $$;

-- Show created data
SELECT 'Companies:' as "---";
SELECT display_id, name, city FROM companies ORDER BY display_id;

SELECT 'Salons:' as "---";
SELECT s.display_id, s.name, s.city, s.status, c.name as company_name 
FROM salons s 
LEFT JOIN companies c ON s.company_id = c.id 
ORDER BY c.display_id, s.display_id;
