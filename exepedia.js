const puppeteer = require('puppeteer');
const fs = require('fs');


function runRetailer () {
    return new Promise(async (resolve, reject) => {
        try {
			//Launch Puppeteer
            const browser = await puppeteer.launch({headless:false});
            //Open New Page in Browser
			const page1 = await browser.newPage();
			await page1.setDefaultNavigationTimeout(0);
			//Go to the link
			await page1.goto("https://www.expedia.com/Hotel-Search?adults=1&d1=2020-07-28&d2=2020-07-29&destination=Chandigarh%20%28and%20vicinity%29%2C%20India&endDate=2020-07-29&latLong=30.708448%2C76.804492&regionId=6135780&rooms=1&semdtl=&sort=RECOMMENDED&startDate=2020-07-28&theme=&useRewards=false&userIntent");
			
			// in Below 14 lines of code we Checked if Load More exist or not if yes than click it
			const LoadMoreSelector = 'button.uitk-button.uitk-button-small.uitk-button-has-text.uitk-button-secondary';
			const isLoadMoreVisible = async (page1, LoadMoreSelector) => {
				let visible = true;
				await page1.waitForSelector(LoadMoreSelector, { visible: true, timeout: 5000 }).catch(() => {
					visible = false;
				});
				return visible;
			};
			let loadMoreVisible = await isLoadMoreVisible(page1, LoadMoreSelector);
			while (loadMoreVisible) {
				await page1.click(LoadMoreSelector).catch(() => {});
				loadMoreVisible = await isLoadMoreVisible(page1, LoadMoreSelector);
			}
			
			let urls='';
			// Pushed the web urls corresponding each to hotel in an array
			const url= await page1.evaluate(() => {
				return Array.from(document.querySelectorAll('a.listing__link.uitk-card-link'), a => a.href)
			});
			console.dir(url, {'maxArrayLength': null});
			 
			 //Dump Outputs in a file
				fs.appendFile('HotelUrls2.json', ` ${JSON.stringify(url, null, 2)}`, function (err) {
					if (err) throw err;
						console.log('....');
				});
			
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
runRetailer().then(console.log).catch(console.error);