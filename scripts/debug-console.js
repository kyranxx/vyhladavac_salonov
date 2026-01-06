const puppeteer = require('puppeteer');

async function debugConsole() {
    console.log('🚀 Starting Browser Console Debugger...');
    const url = 'http://localhost:3001';

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const errors = [];
    const warnings = [];

    // Listen for console logs
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            errors.push({ type: 'ERROR', text: msg.text() });
        } else if (type === 'warning') {
            warnings.push({ type: 'WARNING', text: msg.text() });
        }
    });

    // Listen for page errors (crashes)
    page.on('pageerror', (err) => {
        errors.push({ type: 'CRASH', text: err.message });
    });

    try {
        console.log(`📡 Visiting ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait a bit for async logs
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('\n--- BROWSER CONSOLE REPORT ---');
        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ No errors or warnings found in the console.');
        } else {
            if (errors.length > 0) {
                console.log(`❌ Found ${errors.length} Errors:`);
                errors.forEach(e => console.log(`   [${e.type}] ${e.text}`));
            }
            if (warnings.length > 0) {
                console.log(`⚠️ Found ${warnings.length} Warnings:`);
                warnings.forEach(w => console.log(`   [${w.type}] ${w.text}`));
            }
        }
        console.log('------------------------------\n');

    } catch (error) {
        console.error('❌ Failed to connect to page:', error);
    } finally {
        await browser.close();
        process.exit(0);
    }
}

debugConsole();
