const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';

const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/salony', name: 'Salons List' },
    { path: '/cennik', name: 'Pricing' },
    { path: '/pre-majitelov', name: 'For Owners' },
    { path: '/prihlasenie', name: 'Login' },
    { path: '/registracia', name: 'Register' },
    { path: '/kontakt', name: 'Contact' },
    { path: '/vyhladavanie', name: 'Search' },
    { path: '/ochrana-sukromia', name: 'Privacy' },
    { path: '/obchodne-podmienky', name: 'Terms' },
    { path: '/cookies', name: 'Cookies' },
    { path: '/kategoria/damske-kadernictvo', name: 'Category - Hairdressing' },
    { path: '/salony/bratislava', name: 'City - Bratislava' },
    { path: '/salon/beauty-salon-bratislava', name: 'Salon Detail' },
];

async function runTests() {
    console.log('🧪 Starting Puppeteer tests...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const results = {
        passed: 0,
        failed: 0,
        errors: [],
    };

    for (const page of pages) {
        const testPage = await browser.newPage();
        const consoleMessages = [];
        const errors = [];

        // Capture console messages
        testPage.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleMessages.push(`ERROR: ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                consoleMessages.push(`WARNING: ${msg.text()}`);
            }
        });

        // Capture JavaScript errors
        testPage.on('pageerror', (error) => {
            errors.push(error.message);
        });

        try {
            const url = `${BASE_URL}${page.path}`;
            const response = await testPage.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });

            const status = response.status();
            const title = await testPage.title();

            if (status === 200) {
                console.log(`✅ ${page.name} (${page.path}) - Status: ${status}`);
                results.passed++;
            } else {
                console.log(`❌ ${page.name} (${page.path}) - Status: ${status}`);
                results.failed++;
                results.errors.push({ page: page.name, error: `HTTP ${status}` });
            }

            // Report console errors
            if (consoleMessages.length > 0) {
                console.log(`   ⚠️  Console issues:`);
                consoleMessages.forEach((msg) => console.log(`      - ${msg}`));
            }

            if (errors.length > 0) {
                console.log(`   🔴 JavaScript errors:`);
                errors.forEach((err) => console.log(`      - ${err}`));
            }

        } catch (error) {
            console.log(`❌ ${page.name} (${page.path}) - ERROR: ${error.message}`);
            results.failed++;
            results.errors.push({ page: page.name, error: error.message });
        }

        await testPage.close();
    }

    await browser.close();

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Results: ${results.passed} passed, ${results.failed} failed`);
    console.log('='.repeat(50));

    if (results.failed > 0) {
        console.log('\n❌ Failed tests:');
        results.errors.forEach((e) => console.log(`   - ${e.page}: ${e.error}`));
        process.exit(1);
    } else {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    }
}

runTests().catch(console.error);
