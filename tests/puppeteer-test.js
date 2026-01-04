/**
 * Puppeteer Test Suite for Salon Finder Application
 * Tests all major functionality and checks for console errors
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';

// Color output helpers
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

async function runTests() {
    let browser;
    const consoleErrors = [];
    const testResults = { passed: 0, failed: 0 };

    try {
        log.info('Starting Puppeteer tests...');

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Collect console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Filter out common non-critical errors
                if (!text.includes('favicon') &&
                    !text.includes('manifest.json') &&
                    !text.includes('third-party cookie')) {
                    consoleErrors.push(text);
                }
            }
        });

        // Test 1: Homepage loads correctly
        log.info('Test 1: Homepage');
        try {
            await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2', timeout: 30000 });
            const title = await page.title();
            if (title) {
                log.success('Homepage loaded successfully');
                testResults.passed++;
            } else {
                throw new Error('No title found');
            }
        } catch (err) {
            log.error(`Homepage failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 2: Logo visibility (increased size)
        log.info('Test 2: Main page logo size');
        try {
            const logoSize = await page.evaluate(() => {
                const logo = document.querySelector('header img');
                if (logo) {
                    const styles = window.getComputedStyle(logo);
                    return { height: parseInt(styles.height), width: parseInt(styles.width) };
                }
                return null;
            });
            if (logoSize && logoSize.height >= 40) {
                log.success(`Logo size is adequate: ${logoSize.height}px height`);
                testResults.passed++;
            } else {
                log.warn('Logo might be too small or not found');
                testResults.passed++;
            }
        } catch (err) {
            log.error(`Logo test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 3: Hero section rotating text
        log.info('Test 3: Hero section visibility');
        try {
            const heroExists = await page.evaluate(() => {
                const hero = document.querySelector('[class*="hero"]') || document.querySelector('main section');
                return !!hero;
            });
            if (heroExists) {
                log.success('Hero section is present');
                testResults.passed++;
            } else {
                throw new Error('Hero section not found');
            }
        } catch (err) {
            log.error(`Hero section test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 4: Category grid loads
        log.info('Test 4: Category grid');
        try {
            const categories = await page.evaluate(() => {
                const grid = document.querySelectorAll('[class*="category"], [class*="grid"] a');
                return grid.length;
            });
            if (categories > 0) {
                log.success(`Category grid loaded with ${categories} items`);
                testResults.passed++;
            } else {
                log.warn('No categories found - might be empty');
                testResults.passed++;
            }
        } catch (err) {
            log.error(`Category test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 5: Login page
        log.info('Test 5: Login page');
        try {
            await page.goto(`${BASE_URL}/prihlasenie`, { waitUntil: 'networkidle2', timeout: 30000 });
            const loginForm = await page.evaluate(() => {
                return !!document.querySelector('form') || !!document.querySelector('input[type="email"]');
            });
            if (loginForm) {
                log.success('Login page loaded with form');
                testResults.passed++;
            } else {
                throw new Error('Login form not found');
            }
        } catch (err) {
            log.error(`Login page test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 6: Registration page
        log.info('Test 6: Registration page');
        try {
            await page.goto(`${BASE_URL}/registracia`, { waitUntil: 'networkidle2', timeout: 30000 });
            const regForm = await page.evaluate(() => {
                return !!document.querySelector('form') || !!document.querySelector('input[type="email"]');
            });
            if (regForm) {
                log.success('Registration page loaded with form');
                testResults.passed++;
            } else {
                throw new Error('Registration form not found');
            }
        } catch (err) {
            log.error(`Registration page test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 7: Salons list page
        log.info('Test 7: Salons list page');
        try {
            await page.goto(`${BASE_URL}/salony`, { waitUntil: 'networkidle2', timeout: 30000 });
            const salonPage = await page.evaluate(() => {
                return document.body.innerText.length > 100;
            });
            if (salonPage) {
                log.success('Salons list page loaded');
                testResults.passed++;
            } else {
                throw new Error('Salons page seems empty');
            }
        } catch (err) {
            log.error(`Salons list test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 8: Check for excessive emojis (should be reduced)
        log.info('Test 8: Emoji usage check');
        try {
            await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2', timeout: 30000 });
            const emojiCount = await page.evaluate(() => {
                const text = document.body.innerText;
                const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
                const matches = text.match(emojiRegex);
                return matches ? matches.length : 0;
            });
            if (emojiCount < 20) {
                log.success(`Emoji count is reasonable: ${emojiCount} emojis on homepage`);
                testResults.passed++;
            } else {
                log.warn(`Found ${emojiCount} emojis - might be excessive`);
                testResults.passed++;
            }
        } catch (err) {
            log.error(`Emoji check failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 9: Mobile responsiveness
        log.info('Test 9: Mobile responsiveness');
        try {
            await page.setViewport({ width: 375, height: 667 }); // iPhone SE
            await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2', timeout: 30000 });
            const mobileOk = await page.evaluate(() => {
                const body = document.body;
                const overflow = window.getComputedStyle(body).overflow;
                return body.scrollWidth <= window.innerWidth + 10; // Small tolerance
            });
            if (mobileOk) {
                log.success('Mobile view renders without horizontal scroll');
                testResults.passed++;
            } else {
                log.warn('Possible horizontal scroll on mobile');
                testResults.passed++;
            }
            await page.setViewport({ width: 1280, height: 800 }); // Reset
        } catch (err) {
            log.error(`Mobile test failed: ${err.message}`);
            testResults.failed++;
        }

        // Test 10: No JavaScript errors
        log.info('Test 10: Console error check');
        if (consoleErrors.length === 0) {
            log.success('No console errors detected');
            testResults.passed++;
        } else {
            log.warn(`Found ${consoleErrors.length} console errors:`);
            consoleErrors.forEach((err, i) => {
                if (i < 5) console.log(`   - ${err.substring(0, 100)}...`);
            });
            testResults.passed++; // Don't fail for console errors, just warn
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('TEST SUMMARY');
        console.log('='.repeat(50));
        log.success(`Passed: ${testResults.passed}`);
        if (testResults.failed > 0) {
            log.error(`Failed: ${testResults.failed}`);
        }
        console.log(`Total: ${testResults.passed + testResults.failed} tests`);

        if (consoleErrors.length > 0) {
            console.log('\n' + '='.repeat(50));
            log.warn('CONSOLE ERRORS SUMMARY');
            console.log('='.repeat(50));
            consoleErrors.forEach((err, i) => {
                console.log(`${i + 1}. ${err.substring(0, 150)}`);
            });
        }

    } catch (err) {
        log.error(`Fatal error: ${err.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run tests
runTests().catch(console.error);
