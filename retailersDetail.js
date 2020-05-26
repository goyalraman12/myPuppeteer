const puppeteer = require('puppeteer');
let config = {
	launchOptions: {
		headless:false
	}
}

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch(config.launchOptions);
            const page = await browser.newPage();
            await page.goto("https://www.americasmart.com/browse/#/exhibitor?market=26");
            let urls = await page.evaluate(() => {
                let results = [];
                //let resultJson={};
				let items = document.querySelectorAll('a.amc-gray-5');
                items.forEach((item) => {
					let resultJson={};
                    /*resultJson.url=item.querySelector('a.amc-gray-5').getAttribute('href');
					resultJson.name=item.querySelector('a.amc-gray-5').innerText;  
					*/results.push({
                        url:/*"https://www.americasmart.com/browse/"+*/item.getAttribute('href'),
                        //text: item.innerText,
                    });
					console.log('new url saved to results');
					//results.push(resultJson);
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