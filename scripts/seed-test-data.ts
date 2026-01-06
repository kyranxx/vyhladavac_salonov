/**
 * Comprehensive seed script for Register Salónov
 * Run with: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Realistic Slovak salon data with proper category slugs
const testSalons = [
    // BRATISLAVA - 12 salons
    { name: 'Hair Studio Bratislava', slug: 'hair-studio-bratislava', description_sk: 'Moderný kadernícky salón v srdci Bratislavy. Špecializujeme sa na dámske strihy, farbenie, balayage a regeneráciu vlasov. Náš tím skúsených stylistov vám pomôže nájsť váš ideálny look.', address: 'Obchodná 42', city: 'Bratislava', phone: '+421 902 123 456', email: 'info@hairstudioba.sk', website: 'https://hairstudioba.sk', status: 'approved', tier: 'premium', is_featured: true, category: 'damske-kadernictvo' },
    { name: 'Krása & Štýl Kozmetika', slug: 'krasa-styl-kozmetika', description_sk: 'Luxusný kozmetický salón ponúkajúci kompletné ošetrenia pleti, anti-aging procedúry, make-up a relaxačné procedúry. Používame prémiové značky Guinot a Thalgo.', address: 'Laurinská 15', city: 'Bratislava', phone: '+421 903 234 567', email: 'rezervacie@krasastyl.sk', website: 'https://krasastyl.sk', status: 'approved', tier: 'premium', is_verified: true, category: 'kozmetika' },
    { name: 'Nail Art Studio BA', slug: 'nail-art-studio-ba', description_sk: 'Profesionálna manikúra a pedikúra v centre Bratislavy. Gelové nechty, akrylové nechty, nail art dizajny. Hygienicky sterilné nástroje.', address: 'Mickiewiczova 8', city: 'Bratislava', phone: '+421 910 345 678', email: 'nailart@studio.sk', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'Gentleman Barbershop', slug: 'gentleman-barbershop-ba', description_sk: 'Klasický pánsky barbershop s atmosférou 50. rokov. Tradičné strihy, úprava brady, horúce uteráky. Whisky na privítanie.', address: 'Ventúrska 3', city: 'Bratislava', phone: '+421 904 456 789', website: 'https://gentlemanba.sk', status: 'approved', tier: 'premium', is_featured: true, category: 'barbershop' },
    { name: 'Thai Massage Centrum', slug: 'thai-massage-centrum', description_sk: 'Autentické thajské masáže od certifikovaných masériek priamo z Thajska. Tradičná thajská masáž, olejová masáž, masáž nôh.', address: 'Staromestská 12', city: 'Bratislava', phone: '+421 905 567 890', email: 'rezervacie@thaimassage.sk', status: 'approved', tier: 'premium', category: 'masaze' },
    { name: 'Wellness Oáza Bratislava', slug: 'wellness-oaza-ba', description_sk: 'Kompletné wellness centrum so saunami, vírivkami, masážami a kozmetikou. Ideálne místo pre relax a regeneráciu.', address: 'Panská 28', city: 'Bratislava', phone: '+421 906 678 901', email: 'info@wellnessoaza.sk', website: 'https://wellnessoaza.sk', status: 'approved', tier: 'premium', is_verified: true, category: 'wellness' },
    { name: 'Lash Queen Studio', slug: 'lash-queen-studio-ba', description_sk: 'Profesionálne predĺženie mihalníc metodou 1:1 a objemovou technikou. Lifting mihalníc, lash botox.', address: 'Župné námestie 7', city: 'Bratislava', phone: '+421 907 123 001', email: 'lashqueen@studio.sk', status: 'approved', tier: 'free', category: 'mihalnice' },
    { name: 'Inked Tattoo Bratislava', slug: 'inked-tattoo-ba', description_sk: 'Profesionálne tetovacie štúdio s viac ako 10 ročnými skúsenosťami. Realistické portréty, geometrické vzory, coverupy.', address: 'Židovská 4', city: 'Bratislava', phone: '+421 908 123 002', website: 'https://inkedba.sk', status: 'approved', tier: 'premium', category: 'tetovacie-studio' },
    { name: 'Sun Bronze Solárium', slug: 'sun-bronze-solarium-ba', description_sk: 'Moderné solárium s najnovšími prístrojmi Ergoline. Zdravé opálenie bez slnka. Čisté a hygienické prostredie.', address: 'Krížna 56', city: 'Bratislava', phone: '+421 909 123 003', status: 'approved', tier: 'free', category: 'solarium' },
    { name: 'Fitness Zone Bratislava', slug: 'fitness-zone-ba', description_sk: 'Moderné fitness centrum s osobnými trénermi. Silový tréning, kardio zóna, skupinové cvičenia. Výživové poradenstvo.', address: 'Tomášikova 30', city: 'Bratislava', phone: '+421 910 123 004', email: 'info@fitnesszone.sk', website: 'https://fitnesszone.sk', status: 'approved', tier: 'premium', category: 'fitness' },
    { name: 'Brows & Beauty', slug: 'brows-beauty-ba', description_sk: 'Špecializovaný salón na úpravu obočia. Microblading, powder brows, laminovanie obočia. Permanentný make-up.', address: 'Košická 44', city: 'Bratislava', phone: '+421 911 123 005', email: 'brows@beauty.sk', status: 'approved', tier: 'free', category: 'obocie' },
    { name: 'Bella Pedikúra', slug: 'bella-pedikura-ba', description_sk: 'Profesionálna medicínska a klasická pedikúra. Starostlivosť o problémové nechty a chodidlá.', address: 'Ružová dolina 12', city: 'Bratislava', phone: '+421 912 123 006', status: 'approved', tier: 'free', category: 'pedikura' },

    // KOŠICE - 8 salons
    { name: 'Glamour Hair Košice', slug: 'glamour-hair-kosice', description_sk: 'Prémiový kadernícky salón v Košiciach. Trendy účesy, profesionálne farbenie, svadobné účesy. Tím top stylistov.', address: 'Hlavná 85', city: 'Košice', phone: '+421 907 789 012', email: 'glamour@hair.sk', website: 'https://glamourhair.sk', status: 'approved', tier: 'premium', is_featured: true, category: 'damske-kadernictvo' },
    { name: 'Beauty Queen Salon', slug: 'beauty-queen-salon', description_sk: 'Kozmetický salón s komplexnou starostlivosťou o pleť. Čistenie pleti, chemické peelingy, mezoterapia.', address: 'Mlynská 22', city: 'Košice', phone: '+421 908 890 123', email: 'beautyqueen@salon.sk', status: 'approved', tier: 'free', category: 'kozmetika' },
    { name: 'Nechty Express Košice', slug: 'nechty-express-ke', description_sk: 'Rýchla a kvalitná manikúra bez dlhého čakania. Online rezervácie. Gelové aj akrylové nechty.', address: 'Štúrova 10', city: 'Košice', phone: '+421 909 901 234', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'Barber King Košice', slug: 'barber-king-kosice', description_sk: 'Najlepší barbershop v Košiciach. Klasické a moderné strihy, úprava brady, hot towel shave.', address: 'Alžbetina 34', city: 'Košice', phone: '+421 910 012 345', email: 'king@barber.sk', website: 'https://barberking.sk', status: 'approved', tier: 'premium', is_verified: true, category: 'barbershop' },
    { name: 'Zen Masáže Košice', slug: 'zen-masaze-kosice', description_sk: 'Relaxačné a športové masáže. Certifikovaní maséri. Aromaterapia a reflexológia.', address: 'Kováčska 8', city: 'Košice', phone: '+421 911 234 567', email: 'zen@masaze.sk', status: 'approved', tier: 'free', category: 'masaze' },
    { name: 'Permanent Beauty KE', slug: 'permanent-beauty-ke', description_sk: 'Profesionálny permanentný make-up. Microblading obočia, pery, očné linky. 5+ rokov skúseností.', address: 'Poštová 12', city: 'Košice', phone: '+421 912 345 678', email: 'permanent@beauty.sk', status: 'approved', tier: 'premium', category: 'permanentny-makeup' },
    { name: 'Smooth Skin Depilačné štúdio', slug: 'smooth-skin-ke', description_sk: 'IPL a vosko depilácia pre mužov aj ženy. Profesionálne odstránenie nežiaduceho ochlpenia.', address: 'Masarykova 88', city: 'Košice', phone: '+421 913 456 789', status: 'approved', tier: 'free', category: 'depilacne-studio' },
    { name: 'Pánske kaderníctvo Lion', slug: 'panske-kadernictvo-lion-ke', description_sk: 'Moderné pánske kaderníctvo. Fade strihy, crew cut, účesy podľa najnovších trendov.', address: 'Murgašova 3', city: 'Košice', phone: '+421 914 567 890', status: 'approved', tier: 'free', category: 'panske-kadernictvo' },

    // ŽILINA - 6 salons
    { name: 'Hair Design Žilina', slug: 'hair-design-zilina', description_sk: 'Moderný salón s mladým tímom kreatívnych stylistov. Špecialisti na balayage, ombre a svadobné účesy.', address: 'Národná 12', city: 'Žilina', phone: '+421 911 123 456', email: 'hairdesign@za.sk', status: 'approved', tier: 'premium', category: 'damske-kadernictvo' },
    { name: 'Relax Masáže Žilina', slug: 'relax-masaze-zilina', description_sk: 'Športové masáže, relaxačné masáže, lymfodrenáž a bankovanie. Profesionálny prístup.', address: 'Hurbanova 5', city: 'Žilina', phone: '+421 912 234 567', email: 'relax@masaze.sk', status: 'approved', tier: 'free', category: 'masaze' },
    { name: 'Spa & Wellness Žilina', slug: 'spa-wellness-zilina', description_sk: 'Luxusné wellness centrum s bazénom, saunami a komplexnými spa procedúrami. Denné vstupenky aj členstvá.', address: 'Partizánska 18', city: 'Žilina', phone: '+421 913 345 678', email: 'spa@wellness-za.sk', website: 'https://spaza.sk', status: 'approved', tier: 'premium', is_featured: true, category: 'wellness' },
    { name: 'ArtNails Žilina', slug: 'artnails-zilina', description_sk: 'Umelecká manikúra a nail art. Súťažné dizajny, svadobné nechty, špičková starostlivosť.', address: 'Mariánske námestie 2', city: 'Žilina', phone: '+421 914 456 789', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'Joga Studio Namaste', slug: 'joga-studio-namaste-za', description_sk: 'Joga pre začiatočníkov aj pokročilých. Hatha joga, vinyasa, power joga. Meditácie a pranayama.', address: 'Rosina 45', city: 'Žilina', phone: '+421 915 567 890', email: 'namaste@joga.sk', status: 'approved', tier: 'free', category: 'joga' },
    { name: 'Flash Tattoo Žilina', slug: 'flash-tattoo-zilina', description_sk: 'Tetovacie štúdio s unikátnym štýlom. Old school, neo-traditional, blackwork. Piercings.', address: 'Sasinkova 8', city: 'Žilina', phone: '+421 916 678 901', website: 'https://flashtattoo.sk', status: 'approved', tier: 'premium', category: 'tetovacie-studio' },

    // NITRA - 4 salons
    { name: 'Elegance Kaderníctvo', slug: 'elegance-kadernictvo-nr', description_sk: 'Elegantný salón pre náročnú klientelu. Svadobné účesy, spoločenské účesy, prémiové farbenie.', address: 'Štefánikova 8', city: 'Nitra', phone: '+421 914 456 789', email: 'elegance@hair.sk', status: 'approved', tier: 'premium', category: 'damske-kadernictvo' },
    { name: 'Kozmetika Nitra Centrum', slug: 'kozmetika-nitra-centrum', description_sk: 'Profesionálna kozmetika a permanentný make-up. Hydrafacial, carbon laser, vitamínové infúzie.', address: 'Farská 3', city: 'Nitra', phone: '+421 915 567 890', email: 'kozmetika@nitra.sk', website: 'https://kozmetikanitra.sk', status: 'approved', tier: 'premium', is_verified: true, category: 'kozmetika' },
    { name: 'Perfect Lashes Nitra', slug: 'perfect-lashes-nr', description_sk: 'Predĺženie mihalníc, lifting, laminácia. Certifikované lashmakerky s dlhoročnými skúsenosťami.', address: 'Kupecká 12', city: 'Nitra', phone: '+421 916 678 901', status: 'approved', tier: 'free', category: 'mihalnice' },
    { name: 'Urban Barbers Nitra', slug: 'urban-barbers-nitra', description_sk: 'Mestský barbershop pre pánov. Trendy strihy, beard grooming, head massage.', address: 'Palánok 5', city: 'Nitra', phone: '+421 917 789 012', status: 'approved', tier: 'free', category: 'barbershop' },

    // PREŠOV - 4 salons
    { name: 'Top Hair Prešov', slug: 'top-hair-presov', description_sk: 'Dynamický kadernícky salón s najnovšími svetovými trendmi. Olaplex procedúry, keratin.', address: 'Hlavná 52', city: 'Prešov', phone: '+421 916 678 901', email: 'tophair@presov.sk', status: 'approved', tier: 'premium', category: 'damske-kadernictvo' },
    { name: 'Nails & More Prešov', slug: 'nails-more-presov', description_sk: 'Kompletná starostlivosť o nechty a ruky. Spa manikúra, parafínové zábaly.', address: 'Masarykova 15', city: 'Prešov', phone: '+421 917 789 012', status: 'approved', tier: 'free', category: 'manikura' },
    { name: 'FitLife Prešov', slug: 'fitlife-presov', description_sk: 'Fitness centrum s kardio aj silovou zónou. Personálni tréneri, výživové poradenstvo.', address: 'Námestie legionárov 8', city: 'Prešov', phone: '+421 918 890 123', email: 'fitlife@presov.sk', status: 'approved', tier: 'free', category: 'fitness' },
    { name: 'Aroma Spa Prešov', slug: 'aroma-spa-presov', description_sk: 'Aromaterapeutické masáže a wellness. Esenciálne oleje, celostná starostlivosť o telo a myseľ.', address: 'Grešova 28', city: 'Prešov', phone: '+421 919 901 234', status: 'approved', tier: 'premium', category: 'aromaterapia' },

    // BANSKÁ BYSTRICA - 4 salons
    { name: 'Studio Krása BB', slug: 'studio-krasa-bb', description_sk: 'Multifunkčný salón krásy. Kaderníctvo, kozmetika, manikúra pod jednou strechou.', address: 'Námestie SNP 18', city: 'Banská Bystrica', phone: '+421 918 890 123', email: 'studio@krasabb.sk', website: 'https://krasabb.sk', status: 'approved', tier: 'premium', is_featured: true, category: 'kozmetika' },
    { name: 'Barber Brothers BB', slug: 'barber-brothers-bb', description_sk: 'Bratia barberi s vášňou pre remeslo. Award-winning fade strihy, holenie britvou.', address: 'Horná 25', city: 'Banská Bystrica', phone: '+421 919 901 234', email: 'brothers@barber.sk', status: 'approved', tier: 'premium', category: 'barbershop' },
    { name: 'LaserDerm BB', slug: 'laserderm-bb', description_sk: 'Laserové kozmetické centrum. Odstránenie tetovaní, pigmentácií, omladzovanie pleti.', address: 'Dolná 44', city: 'Banská Bystrica', phone: '+421 920 012 345', email: 'laserderm@bb.sk', status: 'approved', tier: 'premium', category: 'laserove-centrum' },
    { name: 'Kids Hair BB', slug: 'kids-hair-bb', description_sk: 'Špeciálne kaderníctvo pre deti. Hracie kútiky, filmy počas strihania, trpezlivý prístup.', address: 'Kapitulská 12', city: 'Banská Bystrica', phone: '+421 921 123 456', status: 'approved', tier: 'free', category: 'detske-kadernictvo' },

    // TRNAVA - 3 salons
    { name: 'Salon Luxe Trnava', slug: 'salon-luxe-trnava', description_sk: 'Luxusný salón pre všetky služby krásy. VIP priestory, súkromie a profesionálna starostlivosť.', address: 'Hlavná 33', city: 'Trnava', phone: '+421 920 012 345', email: 'luxe@salon-tt.sk', website: 'https://salonluxe.sk', status: 'approved', tier: 'premium', is_verified: true, category: 'wellness' },
    { name: 'Healing Hands Massage', slug: 'healing-hands-trnava', description_sk: 'Terapeutické masáže a fyzioterapia. Liečba bolestí chrbta, rehabilitácia po úrazoch.', address: 'Hollého 7', city: 'Trnava', phone: '+421 921 234 567', email: 'healing@hands.sk', status: 'approved', tier: 'free', category: 'masaze' },
    { name: 'Style Studio TT', slug: 'style-studio-tt', description_sk: 'Moderné kaderníctvo s príjemnou atmosférou. Strihanie, farbenie, styling.', address: 'Vajanského 15', city: 'Trnava', phone: '+421 922 345 678', status: 'approved', tier: 'free', category: 'damske-kadernictvo' },

    // TRENČÍN - 2 salons
    { name: 'Beauty Point Trenčín', slug: 'beauty-point-trencin', description_sk: 'Kozmetický a make-up salón. Permanentný make-up, lash lifting, brow lamination.', address: 'Mierové námestie 3', city: 'Trenčín', phone: '+421 923 456 789', email: 'beauty@point.sk', status: 'approved', tier: 'premium', category: 'kozmetika' },
    { name: 'Barber Club Trenčín', slug: 'barber-club-trencin', description_sk: 'Exkluzívny pánsky barbershop. Členskí klienti, privátne služby, prémiové produkty.', address: 'Hviezdoslavova 22', city: 'Trenčín', phone: '+421 924 567 890', status: 'approved', tier: 'free', category: 'barbershop' },
];

// Sample services for premium salons
const sampleServices = [
    { name: 'Dámsky strih', price: 25, duration_minutes: 45, category: 'hair' },
    { name: 'Pánsky strih', price: 15, duration_minutes: 30, category: 'hair' },
    { name: 'Farbenie vlasov', price: 65, duration_minutes: 120, category: 'hair' },
    { name: 'Balayage', price: 120, duration_minutes: 180, category: 'hair' },
    { name: 'Klasická manikúra', price: 18, duration_minutes: 40, category: 'nails' },
    { name: 'Gelové nechty', price: 35, duration_minutes: 60, category: 'nails' },
    { name: 'Čistenie pleti', price: 40, duration_minutes: 60, category: 'cosmetics' },
    { name: 'Anti-age ošetrenie', price: 75, duration_minutes: 90, category: 'cosmetics' },
    { name: 'Relaxačná masáž (60 min)', price: 45, duration_minutes: 60, category: 'massage' },
    { name: 'Thajská masáž', price: 55, duration_minutes: 60, category: 'massage' },
    { name: 'Športová masáž', price: 50, duration_minutes: 45, category: 'massage' },
    { name: 'Predĺženie mihalníc 1:1', price: 55, duration_minutes: 90, category: 'lashes' },
    { name: 'Objem mihalníc', price: 70, duration_minutes: 120, category: 'lashes' },
    { name: 'Microblading obočia', price: 180, duration_minutes: 120, category: 'brows' },
    { name: 'Úprava obočia', price: 12, duration_minutes: 20, category: 'brows' },
];

// Opening hours template
const defaultOpeningHours = {
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' },
    wednesday: { open: '09:00', close: '18:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '14:00' },
    sunday: { closed: true },
};

async function seedData() {
    console.log('🌱 Starting comprehensive test data seeding...\n');

    // 1. Get or create a test user
    const { data: users } = await supabase.auth.admin.listUsers();
    let ownerId = users?.users?.[0]?.id;

    if (!ownerId) {
        console.error('❌ No users found. Please create a user first.');
        console.log('   You can sign up at your deployed app or create one via Supabase dashboard.');
        process.exit(1);
    }
    console.log(`✓ Using owner ID: ${ownerId}\n`);

    // 2. Get existing categories
    console.log('📁 Loading categories...');
    const { data: categories, error: catError } = await supabase.from('categories').select('id, slug');
    if (catError) {
        console.error('❌ Error loading categories:', catError.message);
        process.exit(1);
    }
    const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);
    console.log(`  ✓ Found ${categoryMap.size} categories\n`);

    // 3. Insert salons
    console.log('💈 Inserting test salons...\n');
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
            continue;
        }

        // Get category ID
        const categoryId = categoryMap.get(category);
        if (!categoryId) {
            console.log(`  ⚠️ Category not found: ${category} for ${salonData.name}`);
        }

        // Insert salon
        const { data: newSalon, error } = await supabase
            .from('salons')
            .insert({
                ...salonData,
                owner_id: ownerId,
                opening_hours: defaultOpeningHours,
                views_count: Math.floor(Math.random() * 500) + 50, // Random views
            })
            .select('id, tier')
            .single();

        if (error) {
            failed++;
            console.log(`  ❌ Failed: ${salonData.name} - ${error.message}`);
            continue;
        }

        // Link to category
        if (newSalon && categoryId) {
            await supabase
                .from('salon_categories')
                .insert({
                    salon_id: newSalon.id,
                    category_id: categoryId,
                    is_primary: true,
                });
        }

        // Add services for premium salons
        if (newSalon && newSalon.tier === 'premium') {
            // Pick 4-6 random services
            const numServices = Math.floor(Math.random() * 3) + 4;
            const shuffledServices = [...sampleServices].sort(() => Math.random() - 0.5);
            const selectedServices = shuffledServices.slice(0, numServices);

            for (const service of selectedServices) {
                await supabase.from('services').insert({
                    salon_id: newSalon.id,
                    ...service,
                    is_active: true,
                });
            }
        }

        created++;
        console.log(`  ✅ ${salonData.name} (${salonData.city})${newSalon?.tier === 'premium' ? ' ⭐' : ''}`);
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 Summary:`);
    console.log(`  ✅ Created: ${created} salons`);
    console.log(`  ⏭️  Skipped: ${skipped} (already exist)`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\n🎉 Test data seeding complete!`);
    console.log(`\nNext steps:`);
    console.log(`  1. Visit your app to see the new salons`);
    console.log(`  2. Run 'npm run build && npm run dev' to test locally`);
}

seedData().catch(console.error);
