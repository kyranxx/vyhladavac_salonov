/**
 * Script to insert test data into Supabase
 * Run with: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test salon data - without postal_code
const testSalons = [
    // BRATISLAVA
    { name: 'Hair Studio Bratislava', slug: 'hair-studio-bratislava', description_sk: 'Moderný kadernícky salón v srdci Bratislavy. Špecializujeme sa na dámske aj pánske strihy, farbenie a regeneráciu vlasov.', address: 'Obchodná 42', city: 'Bratislava', phone: '+421 902 123 456', email: 'info@hairstudioba.sk', status: 'approved', tier: 'premium', category: 'kadernicky-salon' },
    { name: 'Krása & Štýl Kozmetika', slug: 'krasa-styl-kozmetika', description_sk: 'Luxusný kozmetický salón ponúkajúci kompletné ošetrenia pleti, make-up a relaxačné procedúry.', address: 'Laurinská 15', city: 'Bratislava', phone: '+421 903 234 567', email: 'rezervacie@krasastyl.sk', status: 'approved', tier: 'premium', category: 'kozmeticky-salon' },
    { name: 'Nail Art Studio', slug: 'nail-art-studio-ba', description_sk: 'Profesionálna manikúra a pedikúra. Gelové nechty, akrylové nechty, nail art.', address: 'Mickiewiczova 8', city: 'Bratislava', phone: '+421 910 345 678', email: 'nailart@studio.sk', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'Gentleman Barbershop', slug: 'gentleman-barbershop-ba', description_sk: 'Klasický pánsky barbershop. Strihy, holenie, úprava brady.', address: 'Ventúrska 3', city: 'Bratislava', phone: '+421 904 456 789', status: 'approved', tier: 'premium', category: 'barbershop' },
    { name: 'Thai Massage Centrum', slug: 'thai-massage-centrum', description_sk: 'Autentické thajské masáže od certifikovaných masériek z Thajska.', address: 'Staromestská 12', city: 'Bratislava', phone: '+421 905 567 890', email: 'rezervacie@thaimassage.sk', status: 'approved', tier: 'free', category: 'masaze' },
    { name: 'Wellness Oáza', slug: 'wellness-oaza-ba', description_sk: 'Kompletné wellness centrum so saunami, vírivkami a masážami.', address: 'Panská 28', city: 'Bratislava', phone: '+421 906 678 901', email: 'info@wellnessoaza.sk', status: 'approved', tier: 'premium', category: 'wellness' },
    // KOŠICE
    { name: 'Glamour Hair Košice', slug: 'glamour-hair-kosice', description_sk: 'Prémiový kadernícky salón v Košiciach. Trendy účesy, profesionálne farbenie.', address: 'Hlavná 85', city: 'Košice', phone: '+421 907 789 012', email: 'glamour@hair.sk', status: 'approved', tier: 'premium', category: 'kadernicky-salon' },
    { name: 'Beauty Queen Salon', slug: 'beauty-queen-salon', description_sk: 'Kozmetický salón s komplexnou starostlivosťou o pleť.', address: 'Mlynská 22', city: 'Košice', phone: '+421 908 890 123', email: 'beautyqueen@salon.sk', status: 'approved', tier: 'free', category: 'kozmeticky-salon' },
    { name: 'Nechty Express', slug: 'nechty-express-ke', description_sk: 'Rýchla a kvalitná manikúra bez čakania.', address: 'Štúrova 10', city: 'Košice', phone: '+421 909 901 234', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'Barber King Košice', slug: 'barber-king-kosice', description_sk: 'Najlepší barbershop v Košiciach. Klasické strihy, úprava brady.', address: 'Alžbetina 34', city: 'Košice', phone: '+421 910 012 345', email: 'king@barber.sk', status: 'approved', tier: 'premium', category: 'barbershop' },
    // ŽILINA
    { name: 'Hair Design Žilina', slug: 'hair-design-zilina', description_sk: 'Moderný salón s mladým tímom stylistov. Balayage, ombre.', address: 'Národná 12', city: 'Žilina', phone: '+421 911 123 456', email: 'hairdesign@za.sk', status: 'approved', tier: 'free', category: 'kadernicky-salon' },
    { name: 'Relax Masáže Žilina', slug: 'relax-masaze-zilina', description_sk: 'Športové masáže, relaxačné masáže, lymfodrenáž.', address: 'Hurbanova 5', city: 'Žilina', phone: '+421 912 234 567', email: 'relax@masaze.sk', status: 'approved', tier: 'free', category: 'masaze' },
    { name: 'Spa & Wellness Žilina', slug: 'spa-wellness-zilina', description_sk: 'Luxusné wellness centrum s bazénom a saunami.', address: 'Partizánska 18', city: 'Žilina', phone: '+421 913 345 678', email: 'spa@wellness-za.sk', status: 'approved', tier: 'premium', category: 'wellness' },
    // NITRA
    { name: 'Elegance Kaderníctvo', slug: 'elegance-kadernictvo-nr', description_sk: 'Elegantný salón pre náročnú klientelu. Svadobné účesy.', address: 'Štefánikova 8', city: 'Nitra', phone: '+421 914 456 789', email: 'elegance@hair.sk', status: 'approved', tier: 'free', category: 'kadernicky-salon' },
    { name: 'Kozmetika Nitra Centrum', slug: 'kozmetika-nitra-centrum', description_sk: 'Profesionálna kozmetika a permanentný make-up.', address: 'Farská 3', city: 'Nitra', phone: '+421 915 567 890', email: 'kozmetika@nitra.sk', status: 'approved', tier: 'premium', category: 'kozmeticky-salon' },
    // PREŠOV
    { name: 'Top Hair Prešov', slug: 'top-hair-presov', description_sk: 'Dynamický kadernícky salón s najnovšími trendmi.', address: 'Hlavná 52', city: 'Prešov', phone: '+421 916 678 901', email: 'tophair@presov.sk', status: 'approved', tier: 'free', category: 'kadernicky-salon' },
    { name: 'Nails & More Prešov', slug: 'nails-more-presov', description_sk: 'Kompletná starostlivosť o nechty. Gélové nechty, pedikúra.', address: 'Masarykova 15', city: 'Prešov', phone: '+421 917 789 012', status: 'approved', tier: 'free', category: 'manikura' },
    // BANSKÁ BYSTRICA
    { name: 'Studio Krása BB', slug: 'studio-krasa-bb', description_sk: 'Multifunkčný salón krásy. Kaderníctvo, kozmetika, manikúra.', address: 'Námestie SNP 18', city: 'Banská Bystrica', phone: '+421 918 890 123', email: 'studio@krasabb.sk', status: 'approved', tier: 'premium', category: 'kozmeticky-salon' },
    { name: 'Barber Brothers BB', slug: 'barber-brothers-bb', description_sk: 'Bratia barberi s vášňou pre remeslo. Fade strihy, holenie.', address: 'Horná 25', city: 'Banská Bystrica', phone: '+421 919 901 234', email: 'brothers@barber.sk', status: 'approved', tier: 'free', category: 'barbershop' },
    // TRNAVA
    { name: 'Salon Luxe Trnava', slug: 'salon-luxe-trnava', description_sk: 'Luxusný salón pre všetky služby krásy. VIP priestory.', address: 'Hlavná 33', city: 'Trnava', phone: '+421 920 012 345', email: 'luxe@salon-tt.sk', status: 'approved', tier: 'premium', category: 'wellness' },
];

async function seedData() {
    console.log('🌱 Starting test data seeding...\n');

    // 1. Get a user to assign as owner
    const { data: users } = await supabase.auth.admin.listUsers();
    const ownerId = users?.users?.[0]?.id;

    if (!ownerId) {
        console.error('❌ No users found. Please create a user first.');
        process.exit(1);
    }
    console.log(`✓ Using owner ID: ${ownerId}\n`);

    // 2. Get existing categories
    console.log('📁 Loading categories...');
    const { data: categories } = await supabase.from('categories').select('id, slug');
    const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);
    console.log(`  ✓ Found ${categoryMap.size} categories\n`);

    // 3. Insert salons
    console.log('💈 Inserting test salons...');
    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const salon of testSalons) {
        const { category, ...salonData } = salon;

        // Check if already exists
        const { data: existing } = await supabase
            .from('salons')
            .select('id')
            .eq('slug', salonData.slug)
            .single();

        if (existing) {
            skipped++;
            console.log(`  ⏭ Skipped: ${salonData.name} (exists)`);
            continue;
        }

        // Insert salon
        const { data: newSalon, error } = await supabase
            .from('salons')
            .insert({
                ...salonData,
                owner_id: ownerId
            })
            .select('id')
            .single();

        if (error) {
            failed++;
            console.log(`  ❌ Failed: ${salonData.name} - ${error.message}`);
            continue;
        }

        // Link to category
        const categoryId = categoryMap.get(category);
        if (newSalon && categoryId) {
            await supabase
                .from('salon_categories')
                .insert({
                    salon_id: newSalon.id,
                    category_id: categoryId
                });
        }

        created++;
        console.log(`  ✅ ${salonData.name} (${salonData.city})`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Created: ${created} salons`);
    console.log(`  ⏭ Skipped: ${skipped} (already exist)`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`\n🎉 Test data seeding complete!`);
}

seedData().catch(console.error);
