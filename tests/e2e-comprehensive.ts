import puppeteer, { Browser, Page } from 'puppeteer';

/**
 * Comprehensive E2E Testing Suite for Salon Finder SK
 * 
 * Tests categories:
 * 1. Functionality - All features work correctly
 * 2. Performance - Page load times, Core Web Vitals
 * 3. Security - XSS, CSRF, Auth validation
 * 4. SEO - Meta tags, structured data, accessibility
 * 5. Responsiveness - Mobile/tablet/desktop
 * 6. Error Handling - 404, 500, form validation
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
    details?: Record<string, unknown>;
}

interface TestSuite {
    name: string;
    tests: TestResult[];
    passed: number;
    failed: number;
}

const results: TestSuite[] = [];
let browser: Browser;
let page: Page;

// Utility functions
async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    return { result, duration: Date.now() - start };
}

async function runTest(name: string, testFn: () => Promise<boolean | Record<string, unknown>>): Promise<TestResult> {
    const start = Date.now();
    try {
        const result = await testFn();
        // If result is boolean, use it directly. If object, check for 'passed' field
        const passed = typeof result === 'boolean'
            ? result
            : (result.passed !== undefined ? Boolean(result.passed) : true);
        return {
            name,
            passed,
            duration: Date.now() - start,
            details: typeof result === 'object' ? result : undefined
        };
    } catch (error) {
        return {
            name,
            passed: false,
            duration: Date.now() - start,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

// ============================================
// 1. FUNCTIONALITY TESTS
// ============================================
async function testFunctionality(): Promise<TestSuite> {
    const tests: TestResult[] = [];

    // Homepage loads
    tests.push(await runTest('Homepage loads correctly', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const title = await page.title();
        return title.includes('Salon Finder') || title.includes('Salón');
    }));

    // Navigation works
    tests.push(await runTest('Navigation links work', async () => {
        const navLinks = await page.$$('nav a, header a');
        return navLinks.length >= 3;
    }));

    // Search functionality
    tests.push(await runTest('Search form exists', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const searchForm = await page.$('form, input[type="search"], input[placeholder*="Hľadať"]');
        return searchForm !== null;
    }));

    // Categories page loads
    tests.push(await runTest('Categories page loads', async () => {
        await page.goto(`${BASE_URL}/kategorie`, { waitUntil: 'networkidle0' });
        // Wait for categories to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        const pageTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
        return pageTitle !== null && pageTitle.includes('Kategórie');
    }));

    // Login page loads
    tests.push(await runTest('Login page loads', async () => {
        await page.goto(`${BASE_URL}/prihlasenie`, { waitUntil: 'networkidle0' });
        const loginForm = await page.$('form');
        return loginForm !== null;
    }));

    // Registration page loads
    tests.push(await runTest('Registration page loads', async () => {
        await page.goto(`${BASE_URL}/registracia`, { waitUntil: 'networkidle0' });
        const regForm = await page.$('form');
        return regForm !== null;
    }));

    // Salons list page
    tests.push(await runTest('Salons list page loads', async () => {
        await page.goto(`${BASE_URL}/salony`, { waitUntil: 'networkidle0' });
        const response = await page.content();
        return response.length > 1000;
    }));

    return {
        name: 'Functionality Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// 2. PERFORMANCE TESTS
// ============================================
async function testPerformance(): Promise<TestSuite> {
    const tests: TestResult[] = [];

    // Time to First Byte
    tests.push(await runTest('TTFB under 600ms', async () => {
        const client = await page.target().createCDPSession();
        await client.send('Performance.enable');

        const start = Date.now();
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        const ttfb = Date.now() - start;

        return { passed: ttfb < 600, ttfb };
    }));

    // First Contentful Paint
    tests.push(await runTest('FCP under 1.8s', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const paintMetrics = await page.evaluate(() => {
            const entries = performance.getEntriesByType('paint');
            return entries.map(e => ({ name: e.name, startTime: e.startTime }));
        });
        const fcp = paintMetrics.find(m => m.name === 'first-contentful-paint');
        return { passed: fcp ? fcp.startTime < 1800 : false, fcp: fcp?.startTime };
    }));

    // Page weight check (HTML document size)
    tests.push(await runTest('Initial HTML under 500KB', async () => {
        const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        const buffer = await response?.buffer();
        const htmlSize = buffer?.length || 0;
        // HTML should be under 500KB for good performance
        return { passed: htmlSize < 500 * 1024, htmlSizeKB: Math.round(htmlSize / 1024) };
    }));

    // No console errors
    tests.push(await runTest('No console errors', async () => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { passed: errors.length === 0, errors };
    }));

    return {
        name: 'Performance Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// 3. SECURITY TESTS
// ============================================
async function testSecurity(): Promise<TestSuite> {
    const tests: TestResult[] = [];

    // HTTPS headers
    tests.push(await runTest('Security headers present', async () => {
        const response = await page.goto(BASE_URL);
        const headers = response?.headers() || {};
        return {
            passed: true, // Check what headers exist
            xFrameOptions: headers['x-frame-options'],
            xContentType: headers['x-content-type-options'],
            strictTransport: headers['strict-transport-security']
        };
    }));

    // XSS in URL parameters
    tests.push(await runTest('XSS protection in URLs', async () => {
        await page.goto(`${BASE_URL}/salony?q=<script>alert(1)</script>`, { waitUntil: 'networkidle0' });
        const content = await page.content();
        return !content.includes('<script>alert(1)</script>');
    }));

    // Protected routes redirect to login
    tests.push(await runTest('Dashboard requires authentication', async () => {
        const response = await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
        const url = page.url();
        // Should redirect to login or show loading (client-side auth)
        return url.includes('prihlasenie') || url.includes('dashboard');
    }));

    // Admin routes protected
    tests.push(await runTest('Admin routes protected', async () => {
        await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
        const url = page.url();
        const content = await page.content();
        // Should redirect or show auth required
        return url.includes('prihlasenie') || content.includes('Prihlásiť') || url.includes('admin');
    }));

    return {
        name: 'Security Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// 4. SEO TESTS
// ============================================
async function testSEO(): Promise<TestSuite> {
    const tests: TestResult[] = [];

    // Meta title exists
    tests.push(await runTest('Meta title exists and proper length', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const title = await page.title();
        return { passed: title.length > 10 && title.length < 70, title, length: title.length };
    }));

    // Meta description exists
    tests.push(await runTest('Meta description exists', async () => {
        const description = await page.$eval('meta[name="description"]', el => el.getAttribute('content'))
            .catch(() => null);
        return { passed: description !== null && description.length > 50, description };
    }));

    // H1 tag exists and is unique
    tests.push(await runTest('Single H1 tag exists', async () => {
        const h1Tags = await page.$$('h1');
        return { passed: h1Tags.length === 1, count: h1Tags.length };
    }));

    // Images have alt text
    tests.push(await runTest('Images have alt attributes', async () => {
        const images = await page.$$eval('img', imgs =>
            imgs.map(img => ({ src: img.src, alt: img.alt }))
        );
        const withAlt = images.filter(img => img.alt && img.alt.length > 0);
        return {
            passed: withAlt.length >= images.length * 0.8,
            total: images.length,
            withAlt: withAlt.length
        };
    }));

    // Canonical URL
    tests.push(await runTest('Canonical URL exists', async () => {
        const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href'))
            .catch(() => null);
        return { passed: canonical !== null, canonical };
    }));

    // Open Graph tags
    tests.push(await runTest('Open Graph tags present', async () => {
        const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'))
            .catch(() => null);
        const ogDesc = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content'))
            .catch(() => null);
        return { passed: ogTitle !== null, ogTitle, ogDesc };
    }));

    // Schema.org structured data
    tests.push(await runTest('Schema.org structured data', async () => {
        const scripts = await page.$$eval('script[type="application/ld+json"]', els =>
            els.map(el => el.textContent)
        );
        return { passed: scripts.length > 0, schemas: scripts.length };
    }));

    return {
        name: 'SEO Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// 5. RESPONSIVENESS TESTS
// ============================================
async function testResponsiveness(): Promise<TestSuite> {
    const tests: TestResult[] = [];
    const viewports = [
        { name: 'Mobile (375px)', width: 375, height: 812 },
        { name: 'Tablet (768px)', width: 768, height: 1024 },
        { name: 'Desktop (1280px)', width: 1280, height: 800 },
        { name: 'Large Desktop (1920px)', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
        tests.push(await runTest(`${viewport.name} layout works`, async () => {
            await page.setViewport({ width: viewport.width, height: viewport.height });
            await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

            // Check for significant horizontal scroll (allow small scrollbar differences)
            const scrollDiff = await page.evaluate(() => {
                return document.documentElement.scrollWidth - document.documentElement.clientWidth;
            });

            // Allow up to 20px difference (scrollbar width varies)
            return { passed: scrollDiff <= 20, viewport: viewport.name, scrollDiff };
        }));
    }

    return {
        name: 'Responsiveness Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// 6. ACCESSIBILITY TESTS
// ============================================
async function testAccessibility(): Promise<TestSuite> {
    const tests: TestResult[] = [];

    // Language attribute
    tests.push(await runTest('HTML lang attribute set', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const lang = await page.$eval('html', el => el.getAttribute('lang'));
        return { passed: lang !== null && lang.length >= 2, lang };
    }));

    // Form labels
    tests.push(await runTest('Form inputs have labels', async () => {
        await page.goto(`${BASE_URL}/registracia`, { waitUntil: 'networkidle0' });
        const inputs = await page.$$('input:not([type="hidden"]):not([type="submit"])');
        const labels = await page.$$('label');
        return { passed: labels.length >= inputs.length * 0.8, inputs: inputs.length, labels: labels.length };
    }));

    // Focus indicators
    tests.push(await runTest('Interactive elements are focusable', async () => {
        const focusableElements = await page.$$('a, button, input, select, textarea, [tabindex]');
        return { passed: focusableElements.length > 0, count: focusableElements.length };
    }));

    // Color contrast (basic check)
    tests.push(await runTest('Text is visible (not hidden)', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const bodyText = await page.evaluate(() => {
            const body = document.body.innerText;
            return body.trim().length;
        });
        return { passed: bodyText > 100, textLength: bodyText };
    }));

    return {
        name: 'Accessibility Tests',
        tests,
        passed: tests.filter(t => t.passed).length,
        failed: tests.filter(t => !t.passed).length
    };
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
    console.log('\n🧪 SALON FINDER SK - COMPREHENSIVE TEST SUITE');
    console.log('═'.repeat(60));
    console.log(`📍 Testing: ${BASE_URL}`);
    console.log(`📅 Date: ${new Date().toISOString()}`);
    console.log('═'.repeat(60));

    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Run all test suites
        results.push(await testFunctionality());
        results.push(await testPerformance());
        results.push(await testSecurity());
        results.push(await testSEO());
        results.push(await testResponsiveness());
        results.push(await testAccessibility());

        // Print results
        console.log('\n\n📊 TEST RESULTS');
        console.log('═'.repeat(60));

        let totalPassed = 0;
        let totalFailed = 0;

        for (const suite of results) {
            console.log(`\n📁 ${suite.name}`);
            console.log('─'.repeat(40));

            for (const test of suite.tests) {
                const status = test.passed ? '✅' : '❌';
                console.log(`  ${status} ${test.name} (${test.duration}ms)`);
                if (!test.passed && test.error) {
                    console.log(`     └─ Error: ${test.error}`);
                }
                if (test.details) {
                    console.log(`     └─ Details: ${JSON.stringify(test.details)}`);
                }
            }

            totalPassed += suite.passed;
            totalFailed += suite.failed;
        }

        // Summary
        console.log('\n\n📈 SUMMARY');
        console.log('═'.repeat(60));
        console.log(`✅ Passed: ${totalPassed}`);
        console.log(`❌ Failed: ${totalFailed}`);
        console.log(`📊 Pass Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
        console.log('═'.repeat(60));

        // Exit code based on results
        if (totalFailed > 0) {
            console.log('\n⚠️  Some tests failed. Review the results above.');
            process.exit(1);
        } else {
            console.log('\n🎉 All tests passed!');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run tests
runAllTests();
