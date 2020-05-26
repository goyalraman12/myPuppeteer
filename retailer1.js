const puppeteer = require('puppeteer');
let config = {
	launchOptions: {
		headless:false
	}
}



function run () {
    return new Promise(async (resolve, reject) => {
        try {
			console.log('reached in try block')
            const browser = await puppeteer.launch(config.launchOptions);
            const page = await browser.newPage();
            await page.goto("https://www.americasmart.com/browse/#/exhibitor?market=26");
            let urls = await page.evaluate(() => {
                let results = [];
				console.log('results declared')
				let items = document.querySelectorAll('a.amc-gray-5');
                items.forEach((item) => {
					results.push({
                        url:/*"https://www.americasmart.com/browse/"+*/item.getAttribute('href'),
						
                    });
					console.log('new url saved to results');
					//const browser1= await puppeteer.launch();
					const page1 = await browser.newPage();
					await page1.goto("https://www.americasmart.com/browse/"+item.getAttribute('href'))
					let urls1 = await page1.evaluate(() => {
						let resultant = [];
						let items1 = document.querySelectorAll('h3.font-size-26.mbl-font-size-18.bold')
						items1.forEach((item1) => {
							resultant.push({
								name:item1.innerText,
							});
						});
					})
                });
                return results;
            })

            browser.close();
            return resolve(urls);
        } 
		catch (e) {
			return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);





/*
function runRetailer () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch(config.launchOptions);
            const page = await browser.newPage();
            for(var i=0;i<results.length;i++){
				console.log("reached in runRetailer for loop");
				
				await page.goto(results[i]).waitFor(35000);
				let urls = await page.evaluate(() => {
					console.log("reached in runRetailer goto");
					let resultant = [];
					let items = document.querySelectorAll('h3.font-size-26.mbl-font-size-18.bold');
					items.forEach((item) => {
						console.log("reached in runRetailer querSelector");
						resultant.push({
							name: item.innerText,
						});
					});
					return resultant;
				})
				browser.close();
				return resolve(urls);
			}
		}			
		catch (e) {
			return reject(e);
		}
    })
}
runRetailer().then(console.log).catch(console.error);
*/