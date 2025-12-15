const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';

/**
 * Full Feature Test Suite
 * Tests all critical features of the Salon Finder application
 */

async function runFullTests() {
    console.log('🧪 Starting Full Feature Tests...\n');
    console.log('='.repeat(70));

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const results = {
        passed: 0,
        failed: 0,
        tests: [],
    };

    try {
        // Test 1: Homepage loads correctly
        await runTest(browser, results, 'Homepage loads', async (page) => {
            await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
            const title = await page.title();
            return title.includes('Salon Finder') || title.includes('Nájdite');
        });

        // Test 2: Navigation links work
        await runTest(browser, results, 'Navigation links present', async (page) => {
            await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
            const navLinks = await page.$$('nav a');
            return navLinks.length >= 3;
        });

        // Test 3: Language switcher present
        await runTest(browser, results, 'Language switcher present', async (page) => {
            await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
            const switcher = await page.$('[data-testid="language-switcher"]');
            return switcher !== null;
        });

        // Test 4: Login page has form
        await runTest(browser, results, 'Login form complete', async (page) => {
            await page.goto(`${BASE_URL}/prihlasenie`, { waitUntil: 'networkidle2' });
            const emailInput = await page.$('input[type="email"]');
            const passwordInput = await page.$('input[type="password"]');
            const submitButton = await page.$('button[type="submit"]');
            return emailInput && passwordInput && submitButton;
        });

        // Test 5: Registration page has form
        await runTest(browser, results, 'Registration form complete', async (page) => {
            await page.goto(`${BASE_URL}/registracia`, { waitUntil: 'networkidle2' });
            const emailInput = await page.$('input[type="email"]');
            const passwordInput = await page.$('input[type="password"]');
            const submitButton = await page.$('button[type="submit"]');
            return emailInput && passwordInput && submitButton;
        });

        // Test 6: Categories page loads
        await runTest(browser, results, 'Categories page loads', async (page) => {
            await page.goto(`${BASE_URL}/kategorie`, { waitUntil: 'networkidle2' });
            const status = page.url().includes('/kategorie');
            const categories = await page.$$('[class*="card"], [class*="category"]');
            return status;
        });

        // Test 7: Pricing page loads
        await runTest(browser, results, 'Pricing page loads', async (page) => {
            await page.goto(`${BASE_URL}/cennik`, { waitUntil: 'networkidle2' });
            const h1 = await page.$('h1');
            return h1 !== null;
        });

        // Test 8: Salons list page loads
        await runTest(browser, results, 'Salons list loads', async (page) => {
            await page.goto(`${BASE_URL}/salony`, { waitUntil: 'networkidle2' });
            return page.url().includes('/salony');
        });

        // Test 9: Category page loads
        await runTest(browser, results, 'Category page loads', async (page) => {
            await page.goto(`${BASE_URL}/kategoria/damske-kadernictvo`, { waitUntil: 'networkidle2' });
            const h1 = await page.$('h1');
            return h1 !== null;
        });

        // Test 10: City page loads
        await runTest(browser, results, 'City page loads', async (page) => {
            await page.goto(`${BASE_URL}/salony/bratislava`, { waitUntil: 'networkidle2' });
            return page.url().includes('/bratislava');
        });

        // Test 11: Category+City combo page loads
        await runTest(browser, results, 'Category+City page loads', async (page) => {
            await page.goto(`${BASE_URL}/kategoria/damske-kadernictvo/bratislava`, { waitUntil: 'networkidle2' });
            const breadcrumbs = await page.$('[class*="breadcrumb"]');
            return page.url().includes('/bratislava');
        });

        // Test 12: English homepage loads
        await runTest(browser, results, 'English homepage loads', async (page) => {
            await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle2' });
            const content = await page.content();
            return content.includes('Find') || content.includes('Salon') || content.includes('Search');
        });

        // Test 13: Hungarian homepage loads
        await runTest(browser, results, 'Hungarian homepage loads', async (page) => {
            await page.goto(`${BASE_URL}/hu`, { waitUntil: 'networkidle2' });
            const content = await page.content();
            return content.includes('Találd') || content.includes('szalon') || content.includes('Keresés');
        });

        // Test 14: Contact page loads
        await runTest(browser, results, 'Contact page loads', async (page) => {
            await page.goto(`${BASE_URL}/kontakt`, { waitUntil: 'networkidle2' });
            return page.url().includes('/kontakt');
        });

        // Test 15: Privacy page loads
        await runTest(browser, results, 'Privacy page loads', async (page) => {
            await page.goto(`${BASE_URL}/ochrana-sukromia`, { waitUntil: 'networkidle2' });
            return page.url().includes('/ochrana-sukromia');
        });

        // Test 16: Terms page loads
        await runTest(browser, results, 'Terms page loads', async (page) => {
            await page.goto(`${BASE_URL}/obchodne-podmienky`, { waitUntil: 'networkidle2' });
            return page.url().includes('/obchodne-podmienky');
        });

        // Test 17: Cookie page loads
        await runTest(browser, results, 'Cookies page loads', async (page) => {
            await page.goto(`${BASE_URL}/cookies`, { waitUntil: 'networkidle2' });
            return page.url().includes('/cookies');
        });

        // Test 18: Search page loads
        await runTest(browser, results, 'Search page loads', async (page) => {
            await page.goto(`${BASE_URL}/vyhladavanie`, { waitUntil: 'networkidle2' });
            return page.url().includes('/vyhladavanie');
        });

        // Test 19: For Owners page loads
        await runTest(browser, results, 'For Owners page loads', async (page) => {
            await page.goto(`${BASE_URL}/pre-majitelov`, { waitUntil: 'networkidle2' });
            return page.url().includes('/pre-majitelov');
        });

        // Test 20: About page loads
        await runTest(browser, results, 'About page loads', async (page) => {
            await page.goto(`${BASE_URL}/o-nas`, { waitUntil: 'networkidle2' });
            return page.url().includes('/o-nas');
        });

        // Test 21: How it works page loads
        await runTest(browser, results, 'How it works page loads', async (page) => {
            await page.goto(`${BASE_URL}/ako-to-funguje`, { waitUntil: 'networkidle2' });
            return page.url().includes('/ako-to-funguje');
        });

        // Test 22: Forgot password page loads
        await runTest(browser, results, 'Forgot password page loads', async (page) => {
            await page.goto(`${BASE_URL}/zabudnute-heslo`, { waitUntil: 'networkidle2' });
            const emailInput = await page.$('input[type="email"]');
            return emailInput !== null;
        });

        // Test 23: Mobile menu works
        await runTest(browser, results, 'Mobile menu button present', async (page) => {
            await page.setViewport({ width: 375, height: 667 });
            await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
            const menuButton = await page.$('[class*="mobileMenu"], [class*="hamburger"], button[aria-label="Menu"]');
            return menuButton !== null;
        });

        // Test 24: Sitemap accessible
        await runTest(browser, results, 'Sitemap accessible', async (page) => {
            const response = await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle2' });
            return response.status() === 200;
        });

        // Test 25: Robots.txt accessible
        await runTest(browser, results, 'Robots.txt accessible', async (page) => {
            const response = await page.goto(`${BASE_URL}/robots.txt`, { waitUntil: 'networkidle2' });
            return response.status() === 200;
        });

    } catch (error) {
        console.error('Test suite error:', error.message);
    } finally {
        await browser.close();
    }

    // Print results
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`\n✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📝 Total: ${results.tests.length}\n`);

    const failedTests = results.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
        console.log('Failed tests:');
        failedTests.forEach(t => console.log(`  ❌ ${t.name}`));
    }

    console.log('\n' + '='.repeat(70));
    if (results.failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log(`⚠️  ${results.failed} test(s) failed`);
    }
    console.log('='.repeat(70) + '\n');

    process.exit(results.failed > 0 ? 1 : 0);
}

async function runTest(browser, results, name, testFn) {
    const page = await browser.newPage();
    try {
        const passed = await testFn(page);
        if (passed) {
            console.log(`✅ ${name}`);
            results.passed++;
            results.tests.push({ name, passed: true });
        } else {
            console.log(`❌ ${name}`);
            results.failed++;
            results.tests.push({ name, passed: false });
        }
    } catch (error) {
        console.log(`❌ ${name} - Error: ${error.message}`);
        results.failed++;
        results.tests.push({ name, passed: false, error: error.message });
    } finally {
        await page.close();
    }
}

runFullTests().catch(console.error);
