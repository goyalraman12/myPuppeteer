const puppeteer = require('puppeteer');

function runRetailer () {
    return new Promise(async (resolve, reject) => {
        try {
			//const retailers=require('./retailersDetail')
            const browser = await puppeteer.launch({headless:false});
            const page1 = await browser.newPage();
			await page1.setDefaultNavigationTimeout(0);
			await page1.goto("https://www.americasmart.com/browse/#/exhibitor/2994");
			
			
			let urls = await page1.evaluate(() => {
                let result = [];
				
                let item1 = document.querySelectorAll('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div.column.eight > div:nth-child(3) > h3');
                item1.forEach((item) => {
                    result.push({
                        name: item.innerText,						
                    });
                });
				let item2 = document.querySelectorAll('ul.split-list.two.icon-list-3.vertical.no-left-right>li>div>a');
				item2.forEach((item) => {
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("facebook")) )
						{
							result.push({	
								fb: item.getAttribute('href'),
							});
						}	
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("instagram")) )
						{
							result.push({	
								instagram: item.getAttribute('href'),
							});
						}	
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("twitter")) )
						{
							result.push({	
								twitter: item.getAttribute('href'),
							});
						}	
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("pinterest")) )
						{
							result.push({	
								pinterest: item.getAttribute('href'),
							});
						}	
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("mailto")) && (item.getAttribute('href')!="mailto:") )
						{
							var str=item.getAttribute('href');
							var Email= str.substr(7);
							result.push({	
								Email: Email,
							});
						}	
				});
			
				let item3 = document.querySelectorAll('p.amc-gray-4');
				for(var i =0;i<item3.length;i++)
					{
						
						if(i==0)
						{	
							result.push({
								Address: item3[i].innerText,
							});
						}
						if(i==1)
						{	
							result.push({
								City: item3[i].innerText,
							});
						}
						if(i==2)
						{	
							var str = item3[i].innerText;
							var Phone=str.substr(7);
							result.push({
								Phone: Phone,
							});
						}
						if(i==3)
						{	
							var str = item3[i].innerText;
							var Website=str.substr(9);
							result.push({
								Website: Website,
							});
						}	
					}
				/*
				let item4 = document.querySelectorAll('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div:nth-child(4) > ul > li:nth-child(3) > div > a');
				item4.forEach((item) => {
                    result.push({
						instagram: item.getAttribute('href'),
                    });
                });
				let item5 = document.querySelectorAll('body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div:nth-child(5) > ul > li:nth-child(1) > div > a');
				item5.forEach((item) => {
                    result.push({
						email: item.getAttribute('href'),
                    });
                });
				*/
				
				
                return result;
			})	
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
runRetailer().then(console.log).catch(console.error);