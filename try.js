const puppeteer = require('puppeteer');

function runRetailer () {
    return new Promise(async (resolve, reject) => {
        try {
			//const retailers=require('./retailersDetail')
            const browser = await puppeteer.launch({headless:false});
            const page1 = await browser.newPage();
			//page1.on("console", (consoleObj) => console.log(consoleObj.text()));
			await page1.setDefaultNavigationTimeout(0);
			await page1.goto("https://www.americasmart.com/browse/#/exhibitor?market=26");
			await page1.waitFor(2000);
			const retailers= await page1.evaluate(() => Array.from(document.querySelectorAll('a.amc-gray-5'), a => a.href));
			//page1.close();
			console.log(retailers);
			await page1.waitFor(2500);
			console.log("Test");
				
				
				/*let listLength = await page.evaluate((sel) => {
				return document.getElementsByClassName(sel).length;
				}, LENGTH_SELECTOR_CLASS);
					*/
					
				let result = [];	
				let urls = '';
				for (const retailer of retailers) {
					
					await page1.goto(retailer);
					
					const Name_Selector_Class='body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div.column.eight > div:nth-child(3) > h3';
					
					/*let retailerName = await page1.evaluate((sel) => {
					return document.getElementsByClassName(sel).innerText;
					}, Name_Selector_Class);	
					
					console.log(retailerName);
					*/
					await page1.waitFor(5000);
					
					console.log("Array of Retailers:",retailer);	
					urls = await page1.evaluate((result) => {
						
						console.log('reached in evaluate');
						let item1 = document.querySelector('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div.column.eight > div:nth-child(3) > h3');
						
							
							result.push({
								name: item1.innerText,
							});
						
						let item2 = document.querySelector('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div:nth-child(4) > ul > li:nth-child(1) > div > a');
							
							result.push({
								fb: item.getAttribute('href'),
							});
						
					
						let item3 = document.querySelector('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div.column.eight > div:nth-child(3) > div > p:nth-child(3) > a');
						
							result.push({
								number: item.innerText,
							});
						
						let item4 = document.querySelector('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div:nth-child(4) > ul > li:nth-child(3) > div > a');
						
							result.push({
								instagram: item.getAttribute('href'),
							});
						
						let item5 = document.querySelector('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div:nth-child(5) > ul > li:nth-child(1) > div > a');
						
							result.push({
								email: item.getAttribute('href'),
							});
						
						
						
						return result;
					}, result)
					
				
				
					//await page1.waitFor(100000);
				}
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
runRetailer().then(console.log).catch(console.error);




