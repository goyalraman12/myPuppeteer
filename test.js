const puppeteer = require('puppeteer');

let config = {
	launchOptions: {
		headless:false
	}
}

puppeteer.launch(config.launchOptions).then(async browser => {
	const page = await browser.newPage();
	await page.goto('https://github.com/puppeteer/puppeteer/tree/7fded54903d25206031631a4d3a78aec61b38db9')
	
});