const puppeteer = require('puppeteer');

async function checkVitalsAndMobile() {
    console.log('📊 Starting Performance & Mobile Layout Audit...');
    const url = 'http://localhost:3001';

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // 1. MOBILE VIEW CHECK
    console.log('📱 Checking Mobile Layout (iPhone 12)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const horizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // 2. PERFORMANCE VITALS
    console.log('⚡ Measuring Speed Vitals...');
    const metrics = await page.metrics();
    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]))
    );

    const loadTime = performanceTiming.loadEventEnd - performanceTiming.startTime;
    const domReady = performanceTiming.domContentLoadedEventEnd - performanceTiming.startTime;

    console.log('\n--- AUDIT REPORT ---');
    console.log(`Mobile Horizontal Scroll: ${horizontalScroll ? '❌ FOUND (Problem!)' : '✅ NONE (Good!)'}`);
    console.log(`Page Load Time: ${(loadTime / 1000).toFixed(2)}s`);
    console.log(`DOM Content Loaded: ${(domReady / 1000).toFixed(2)}s`);
    console.log(`JS Heap Used: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)} MB`);
    console.log('--------------------\n');

    await browser.close();
    process.exit(0);
}

checkVitalsAndMobile();
