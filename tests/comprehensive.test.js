const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';

// All pages categorized
const pages = {
    main: [
        { path: '/', name: 'Homepage SK' },
        { path: '/en', name: 'Homepage EN' },
        { path: '/hu', name: 'Homepage HU' },
        { path: '/salony', name: 'Salons List' },
        { path: '/kategorie', name: 'Categories List' },
        { path: '/cennik', name: 'Pricing' },
        { path: '/pre-majitelov', name: 'For Owners' },
        { path: '/o-nas', name: 'About Us' },
        { path: '/ako-to-funguje', name: 'How It Works' },
        { path: '/kontakt', name: 'Contact' },
        { path: '/vyhladavanie', name: 'Search' },
    ],
    auth: [
        { path: '/prihlasenie', name: 'Login' },
        { path: '/registracia', name: 'Register' },
        { path: '/zabudnute-heslo', name: 'Forgot Password' },
    ],
    legal: [
        { path: '/ochrana-sukromia', name: 'Privacy SK' },
        { path: '/obchodne-podmienky', name: 'Terms' },
        { path: '/cookies', name: 'Cookies' },
    ],
    localized: [
        { path: '/en/o-nas', name: 'About EN' },
        { path: '/en/ako-to-funguje', name: 'How It Works EN' },
        { path: '/en/pre-majitelov', name: 'For Owners EN' },
        { path: '/en/kategorie', name: 'Categories EN' },
        { path: '/en/prihlasenie', name: 'Login EN' },
        { path: '/en/registracia', name: 'Register EN' },
        { path: '/hu/o-nas', name: 'About HU' },
        { path: '/hu/ako-to-funguje', name: 'How It Works HU' },
        { path: '/hu/pre-majitelov', name: 'For Owners HU' },
        { path: '/hu/kategorie', name: 'Categories HU' },
        { path: '/hu/prihlasenie', name: 'Login HU' },
        { path: '/hu/registracia', name: 'Register HU' },
    ],
    category: [
        { path: '/kategoria/damske-kadernictvo', name: 'Category - Hairdressing' },
        { path: '/kategoria/nechtove-studio', name: 'Category - Nails' },
        { path: '/kategoria/kozmeticky-salon', name: 'Category - Cosmetics' },
    ],
    city: [
        { path: '/salony/bratislava', name: 'City - Bratislava' },
        { path: '/salony/kosice', name: 'City - Kosice' },
    ],
    salon: [
        { path: '/salon/beauty-salon-bratislava', name: 'Salon Detail' },
    ],
};

// Mock data indicators
const MOCK_DATA_PATTERNS = [
    'lorem ipsum',
    'test salon',
    'example salon',
    'sample data',
    'mock data',
    'placeholder',
    'TODO',
    'FIXME',
    '+421 000 000 000',
    'example@email.com',
    'test@test.com',
    'fake address',
];

// Untranslated text patterns (Slovak text that shouldn't appear in EN/HU)
const UNTRANSLATED_SK_PATTERNS = [
    'Ďalšie kategórie',
    'Zobraziť všetky',
    'Načítavanie',
    'Naše služby',
    'Prečo si vybrať nás',
];

async function runComprehensiveTests() {
    console.log('🧪 Starting Comprehensive Tests...\n');
    console.log('='.repeat(70));

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const results = {
        passed: 0,
        failed: 0,
        warnings: 0,
        consoleErrors: [],
        mockDataFound: [],
        translationIssues: [],
        brokenButtons: [],
        errors: [],
    };

    const allPages = [
        ...pages.main,
        ...pages.auth,
        ...pages.legal,
        ...pages.localized,
        ...pages.category,
        ...pages.city,
        ...pages.salon,
    ];

    console.log(`\n📄 Testing ${allPages.length} pages...\n`);

    for (const page of allPages) {
        await testPage(browser, page, results);
    }

    // Test buttons and interactive elements on key pages
    console.log('\n🔘 Testing buttons and interactive elements...\n');
    await testButtons(browser, results);

    await browser.close();

    // Print summary
    printSummary(results);
}

async function testPage(browser, page, results) {
    const testPage = await browser.newPage();
    const consoleMessages = [];
    const jsErrors = [];

    // Capture console messages
    testPage.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        // Filter out known harmless messages
        if (text.includes('Download the React DevTools') ||
            text.includes('webpack-internal') ||
            text.includes('Puppeteer') ||
            text.includes('favicon')) {
            return;
        }

        if (type === 'error') {
            consoleMessages.push({ type: 'ERROR', text });
        } else if (type === 'warning') {
            consoleMessages.push({ type: 'WARNING', text });
        }
    });

    // Capture JavaScript errors
    testPage.on('pageerror', (error) => {
        jsErrors.push(error.message);
    });

    try {
        const url = `${BASE_URL}${page.path}`;
        const response = await testPage.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
        });

        const status = response.status();

        if (status === 200) {
            console.log(`✅ ${page.name} (${page.path})`);
            results.passed++;
        } else if (status === 404) {
            console.log(`❌ ${page.name} (${page.path}) - 404 Not Found`);
            results.failed++;
            results.errors.push({ page: page.name, path: page.path, error: 'Page not found (404)' });
        } else {
            console.log(`⚠️  ${page.name} (${page.path}) - Status: ${status}`);
            results.warnings++;
        }

        // Check for console errors
        if (consoleMessages.length > 0) {
            const errors = consoleMessages.filter(m => m.type === 'ERROR');
            if (errors.length > 0) {
                console.log(`   🔴 Console errors:`);
                errors.forEach(e => {
                    console.log(`      - ${e.text.substring(0, 100)}...`);
                    results.consoleErrors.push({ page: page.name, path: page.path, error: e.text });
                });
            }
        }

        // Check for JS errors
        if (jsErrors.length > 0) {
            console.log(`   🔴 JavaScript errors:`);
            jsErrors.forEach(err => {
                console.log(`      - ${err.substring(0, 100)}...`);
                results.consoleErrors.push({ page: page.name, path: page.path, error: err });
            });
        }

        // Check for mock data
        const bodyText = await testPage.evaluate(() => document.body.innerText.toLowerCase());
        for (const pattern of MOCK_DATA_PATTERNS) {
            if (bodyText.includes(pattern.toLowerCase())) {
                results.mockDataFound.push({ page: page.name, path: page.path, pattern });
                console.log(`   ⚠️  Mock data found: "${pattern}"`);
            }
        }

        // Check translations for EN/HU pages
        if (page.path.startsWith('/en') || page.path.startsWith('/hu')) {
            for (const pattern of UNTRANSLATED_SK_PATTERNS) {
                if (bodyText.includes(pattern.toLowerCase())) {
                    results.translationIssues.push({ page: page.name, path: page.path, pattern });
                    console.log(`   ⚠️  Untranslated text found: "${pattern}"`);
                }
            }
        }

    } catch (error) {
        console.log(`❌ ${page.name} (${page.path}) - ERROR: ${error.message}`);
        results.failed++;
        results.errors.push({ page: page.name, path: page.path, error: error.message });
    }

    await testPage.close();
}

async function testButtons(browser, results) {
    const testPage = await browser.newPage();

    try {
        // Test Homepage buttons
        await testPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

        // Check for clickable buttons
        const buttons = await testPage.$$eval('button, a.btn, [role="button"]',
            els => els.map(el => ({
                text: el.innerText,
                href: el.href || null,
                disabled: el.disabled || false,
                visible: el.offsetParent !== null,
            }))
        );

        console.log(`   Found ${buttons.length} buttons/links on homepage`);

        const visibleButtons = buttons.filter(b => b.visible && b.text.trim());
        console.log(`   Visible interactive buttons: ${visibleButtons.length}`);

        // Check language switcher
        const langSwitcher = await testPage.$('[data-testid="language-switcher"], .language-switcher');
        if (langSwitcher) {
            console.log(`   ✅ Language switcher found`);
        } else {
            console.log(`   ⚠️  Language switcher not found (or not marked with testid)`);
        }

        // Test navigation links
        const navLinks = await testPage.$$eval('nav a, header a',
            els => els.map(el => ({ text: el.innerText, href: el.href }))
        );
        console.log(`   Found ${navLinks.length} navigation links`);

        // Test search form if exists
        const searchForm = await testPage.$('form[action*="vyhladavanie"], input[type="search"], input[placeholder*="Hľadať"]');
        if (searchForm) {
            console.log(`   ✅ Search form found`);
        }

        // Test login page
        await testPage.goto(`${BASE_URL}/prihlasenie`, { waitUntil: 'networkidle2' });

        const loginForm = await testPage.$('form');
        const emailInput = await testPage.$('input[type="email"], input[name="email"]');
        const passwordInput = await testPage.$('input[type="password"]');
        const loginButton = await testPage.$('button[type="submit"]');
        const googleButton = await testPage.$('button[data-provider="google"], .google-login');

        if (loginForm && emailInput && passwordInput && loginButton) {
            console.log(`   ✅ Login form complete with all fields`);
        } else {
            console.log(`   ⚠️  Login form incomplete`);
            results.brokenButtons.push({ page: 'Login', issue: 'Form missing required fields' });
        }

        // Test register page
        await testPage.goto(`${BASE_URL}/registracia`, { waitUntil: 'networkidle2' });

        const registerForm = await testPage.$('form');
        const nameInput = await testPage.$('input[name="name"], input[name="full_name"]');
        const regEmailInput = await testPage.$('input[type="email"], input[name="email"]');
        const regPasswordInput = await testPage.$('input[type="password"]');

        if (registerForm && regEmailInput && regPasswordInput) {
            console.log(`   ✅ Registration form present`);
        } else {
            console.log(`   ⚠️  Registration form incomplete`);
            results.brokenButtons.push({ page: 'Register', issue: 'Form missing required fields' });
        }

        // Test pricing page buttons
        await testPage.goto(`${BASE_URL}/cennik`, { waitUntil: 'networkidle2' });

        const pricingButtons = await testPage.$$eval('button, a.btn, [role="button"]',
            els => els.filter(el => el.offsetParent !== null).map(el => el.innerText)
        );
        console.log(`   Found ${pricingButtons.length} CTA buttons on pricing page`);

    } catch (error) {
        console.log(`   ❌ Button testing error: ${error.message}`);
        results.errors.push({ page: 'Button Tests', error: error.message });
    }

    await testPage.close();
}

function printSummary(results) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(70));

    console.log(`\n✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings}`);

    if (results.consoleErrors.length > 0) {
        console.log(`\n🔴 Console Errors (${results.consoleErrors.length}):`);
        const uniqueErrors = [...new Set(results.consoleErrors.map(e => `${e.page}: ${e.error.substring(0, 80)}`))];
        uniqueErrors.forEach(e => console.log(`   - ${e}`));
    }

    if (results.mockDataFound.length > 0) {
        console.log(`\n⚠️  Mock Data Found (${results.mockDataFound.length}):`);
        results.mockDataFound.forEach(m => console.log(`   - ${m.page}: "${m.pattern}"`));
    }

    if (results.translationIssues.length > 0) {
        console.log(`\n🌐 Translation Issues (${results.translationIssues.length}):`);
        results.translationIssues.forEach(t => console.log(`   - ${t.page}: "${t.pattern}"`));
    }

    if (results.brokenButtons.length > 0) {
        console.log(`\n🔘 Button Issues (${results.brokenButtons.length}):`);
        results.brokenButtons.forEach(b => console.log(`   - ${b.page}: ${b.issue}`));
    }

    if (results.errors.length > 0) {
        console.log(`\n❌ Errors:`);
        results.errors.forEach(e => console.log(`   - ${e.page || e.path}: ${e.error}`));
    }

    console.log('\n' + '='.repeat(70));

    if (results.failed === 0 && results.consoleErrors.length === 0) {
        console.log('🎉 All tests passed with no console errors!');
    } else if (results.failed === 0) {
        console.log('✅ All pages load, but there are console errors to fix.');
    } else {
        console.log('❌ Some tests failed. Please review the issues above.');
    }

    console.log('='.repeat(70) + '\n');

    process.exit(results.failed > 0 ? 1 : 0);
}

runComprehensiveTests().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
});
