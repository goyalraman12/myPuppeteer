const puppeteer = require('puppeteer');
function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.americasmart.com/browse/#/exhibitor/58987");
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('h3.font-size-26.mbl-font-size-18.bold');
                items.forEach((item) => {
                    results.push({
                        text: item.innerText,
                    });
                });
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);