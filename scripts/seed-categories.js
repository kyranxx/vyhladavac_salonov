// Seed categories to Supabase database
const { createClient } = require('@supabase/supabase-js');

const categories = [
    { slug: 'damske-kadernictvo', name_sk: 'Dámske kaderníctvo', name_en: 'Women\'s Hair Salon', name_hu: 'Női fodrászat', icon: '💇‍♀️', category_type: 'primary', sort_order: 1 },
    { slug: 'panske-kadernictvo', name_sk: 'Pánske kaderníctvo', name_en: 'Men\'s Hair Salon', name_hu: 'Férfi fodrászat', icon: '💇‍♂️', category_type: 'primary', sort_order: 2 },
    { slug: 'kozmetika', name_sk: 'Kozmetika', name_en: 'Cosmetics', name_hu: 'Kozmetika', icon: '✨', category_type: 'primary', sort_order: 3 },
    { slug: 'manikura', name_sk: 'Manikúra', name_en: 'Manicure', name_hu: 'Manikűr', icon: '💅', category_type: 'primary', sort_order: 4 },
    { slug: 'pedikura', name_sk: 'Pedikúra', name_en: 'Pedicure', name_hu: 'Pedikűr', icon: '🦶', category_type: 'primary', sort_order: 5 },
    { slug: 'masaze', name_sk: 'Masáže', name_en: 'Massage', name_hu: 'Masszázs', icon: '💆', category_type: 'primary', sort_order: 6 },
    { slug: 'barbershop', name_sk: 'Barbershop', name_en: 'Barbershop', name_hu: 'Borbély', icon: '✂️', category_type: 'primary', sort_order: 7 },
    { slug: 'wellness', name_sk: 'Wellness', name_en: 'Wellness', name_hu: 'Wellness', icon: '🧖', category_type: 'primary', sort_order: 8 },
    { slug: 'make-up', name_sk: 'Make-up', name_en: 'Make-up', name_hu: 'Smink', icon: '💄', category_type: 'secondary', sort_order: 9 },
    { slug: 'mihalnice', name_sk: 'Mihalnice', name_en: 'Eyelashes', name_hu: 'Szempillák', icon: '👁️', category_type: 'secondary', sort_order: 10 },
    { slug: 'tetovanie', name_sk: 'Tetovanie', name_en: 'Tattoo', name_hu: 'Tetoválás', icon: '🎨', category_type: 'secondary', sort_order: 11 },
    { slug: 'permanentny-make-up', name_sk: 'Permanentný make-up', name_en: 'Permanent Make-up', name_hu: 'Permanens smink', icon: '✏️', category_type: 'secondary', sort_order: 12 },
    { slug: 'solarium', name_sk: 'Solárium', name_en: 'Solarium', name_hu: 'Szolárium', icon: '☀️', category_type: 'secondary', sort_order: 13 },
    { slug: 'obocie', name_sk: 'Obočie', name_en: 'Eyebrows', name_hu: 'Szemöldök', icon: '🖌️', category_type: 'secondary', sort_order: 14 },
    { slug: 'fitness', name_sk: 'Fitness', name_en: 'Fitness', name_hu: 'Fitness', icon: '💪', category_type: 'secondary', sort_order: 15 },
    { slug: 'laserove-centrum', name_sk: 'Laserové centrum', name_en: 'Laser Center', name_hu: 'Lézer központ', icon: '🔬', category_type: 'secondary', sort_order: 16 },
];

async function seedCategories() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txodloobftonmurltjpm.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2Rsb29iZnRvbm11cmx0anBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU0MTc4MCwiZXhwIjoyMDgxMTE3NzgwfQ.4H18BL2Q0kPEGoTuD38v30NH-U3__QvI-yYI8eT7jFI';

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🌱 Seeding categories...');

    for (const category of categories) {
        const { error } = await supabase
            .from('categories')
            .upsert(category, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Error seeding ${category.slug}:`, error.message);
        } else {
            console.log(`✅ ${category.name_sk}`);
        }
    }

    // Show count
    const { data, error: countError } = await supabase
        .from('categories')
        .select('*');

    if (!countError && data) {
        console.log(`\n📊 Total categories in database: ${data.length}`);
    }

    console.log('\n✨ Done seeding categories!');
}

seedCategories();
