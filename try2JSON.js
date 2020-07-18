const puppeteer = require('puppeteer');
const fs = require('fs');


function runRetailer () {
    return new Promise(async (resolve, reject) => {
        try {
			//Launch Puppeteer
            const browser = await puppeteer.launch({headless:true});
            //Open New Page in Browser
			const page1 = await browser.newPage();
			await page1.setDefaultNavigationTimeout(0);
			//Go to the link
			await page1.goto("https://www.americasmart.com/browse/#/exhibitor?market=26");
			
			// in Below 14 lines of code we Checked if Load More exist or not if yes than click it
			const LoadMoreSelector = 'a.bttn.blue.size-200';
			const isLoadMoreVisible = async (page1, LoadMoreSelector) => {
				let visible = true;
				await page1.waitForSelector(LoadMoreSelector, { visible: true, timeout: 2000 }).catch(() => {
					visible = false;
				});
				return visible;
			};
			
			let loadMoreVisible = await isLoadMoreVisible(page1, LoadMoreSelector);
			while (loadMoreVisible) {
				await page1.click(LoadMoreSelector).catch(() => {});
				loadMoreVisible = await isLoadMoreVisible(page1, LoadMoreSelector);
			}
			
			// Pushed the web urls corresponding each to retailer in an array
			const retailers= await page1.evaluate(() => {
				return Array.from(document.querySelectorAll('a.amc-gray-5'), a => a.href)
			});
			//console.dir(retailers, {'maxArrayLength': null});
			await page1.waitFor('a.amc-gray-5');
			
			let result = [];
			let urls = '';
			const Name_Selector_Class='body > div.background > div.grid-wrapper.container > div:nth-child(3) > ng-view > div:nth-child(3) > div.grid-wrapper.gray-0-bg > div > div.column.six.tbl-max > div > div:nth-child(2) > div > div > div.column.eight > div:nth-child(3) > h3';
			const Social_Media_Selector_Class='ul.split-list.two.icon-list-3.vertical.no-left-right>li>div>a';
			const Contact_Details_Selector_Class='p.amc-gray-4';
			const Category_Selector_Class='ul.split-list.three.category-list>li'
			const Description_Selector_Class='p.text-lead.width-95'
			var retailerCount=1;
			
			//Goto to each retailer for fetching details 
			for (const retailer of retailers) {
				
				await page1.goto(retailer);
				//console.log("Array of Retailers:",retailer);
				await page1.waitFor('h4.amc-gray-7.bold');

				//Push retailer name in an array
				let retailerName = await page1.evaluate((sel) => {
					return document.querySelector(sel).innerText;
				},Name_Selector_Class);
				
				//Push Description Corresponding to the retailer in an array
				let retailerDescription = await page1.evaluate((sel)=>{
					let item0= document.querySelector(sel);
					if(item0.hasAttribute('ng-bind-html'))
					{
						if(item0.getAttribute('ng-bind-html')=="vm.description")
						{
							let item1=document.querySelectorAll('p.text-lead.width-95>p');
							var description="";
							item1.forEach((item)=>{
								description=""+item.innerText+" ";
							});
							if(description.includes("\n\n"))
								description = description.replace(/\n\n/g, "  "); //convert to JSON string to remove the br tag
							if(description.includes("\n"))
								description = description.replace(/\n/g, " ");
						}
						return description;
					}
					else
						return document.querySelector(sel).innerText;
				}, Description_Selector_Class)
			
				//Push Social Media Handles into an array
				let retailerFBHandle = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					for(var i=0;i<item2.length;i++){
						// Check if its FB Handle, Push it with Fb headline in Social Media Handles Array 
						if((item2[i].getAttribute('href')!= null) && (item2[i].getAttribute('href').includes("facebook")) )
						{
							return item2[i].getAttribute('href');
							/*result.push({	
								fb: item2[i].getAttribute('href'),
							});*/
						}
						else
							continue;
					}	
				},Social_Media_Selector_Class);
				let retailerInstagramHandle = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					for(var i=0;i<item2.length;i++){
						// Check if its Instagram Handle, Push it with Instagram headline in Social Media Handles Array		
						if((item2[i].getAttribute('href')!= null) && (item2[i].getAttribute('href').includes("instagram")) )
						{
							return item2[i].getAttribute('href');
							/*result.push({	
								instagram: item2[i].getAttribute('href'),
							});*/
						}
						else
							continue;
					}
				},Social_Media_Selector_Class);
				
				//Remove Comment if You need Twitter Details
				/*let retailerTwitterHandle = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					item2.forEach((item) => {
						// Check if its Twitter Handle, Push it with Twitter headline in Social Media Handles Array		
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("twitter")) )
						{
							result.push({	
								twitter: item.getAttribute('href'),
							});
						}
					})
					return result;
				},Social_Media_Selector_Class);*/
				
				let retailerPinterestHandle = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					for(var i=0;i<item2.length;i++){
						// Check if its Pinterest Handle, Push it with Pinterest headline in Social Media Handles Array		
						if((item2[i].getAttribute('href')!= null) && (item2[i].getAttribute('href').includes("pinterest")) )
						{
							return item2[i].getAttribute('href');
							/*result.push({	
								pinterest: item2[i].getAttribute('href'),
							});*/
						}
						else
							continue;
					}
				},Social_Media_Selector_Class);
				let retailerEmailHandle = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					for(var i=0;i<item2.length;i++){
						// Check if its Email Handle, Push it with Email headline in Social Media Handles Array			
						if((item2[i].getAttribute('href')!= null) && (item2[i].getAttribute('href').includes("mailto")) && (item2[i].getAttribute('href')!="mailto:") )
						{
							var str=item2[i].getAttribute('href');
							var Email= str.substr(7);
							return Email;
							/*result.push({	
								Email: Email,
								// Show Contact Person Name as well along with email address 
								ContactPerson: item2[i].innerText,
							});*/
						}
						else
							continue;		
					}
					
				},Social_Media_Selector_Class);
				let retailerEmailHandlerName = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					for(var i=0;i<item2.length;i++){
						// Check if its Email Handle, Push it with Email headline in Social Media Handles Array			
						if((item2[i].getAttribute('href')!= null) && (item2[i].getAttribute('href').includes("mailto")) && (item2[i].getAttribute('href')!="mailto:") )
						{
							return item2[i].innerText;
							/*result.push({	
								Email: Email,
								// Show Contact Person Name as well along with email address 
								ContactPerson: item2[i].innerText,
							});*/
						}
						else
							continue;		
					}
					
				},Social_Media_Selector_Class);
				
				//Push Basic Contact Details in an array
				let retailerAddressDetails = await page1.evaluate((sel) => {
					let result=[];
					let item3 = document.querySelectorAll(sel);
					for(var i =1;i<item3.length;i++)
					{	var str = item3[i].innerText;					
						if(item3[i].hasAttribute('ng-if') )
						{
							if(item3[i].getAttribute('ng-if') == "vm.exhibitor.address2")
							{
								result.push({
									AddressLine1: item3[0].innerText,
									AddressLine2: item3[1].innerText,
								});
							}
							return result;
						}
						else
							return item3[0].innerText
					}
					return address;
				},Contact_Details_Selector_Class);
				let retailerCityDetails = await page1.evaluate((sel) => {
					let result=[];
					let item3 = document.querySelectorAll(sel);
					for(var i =0;i<item3.length;i++)
					{	
						var str = item3[i].innerText;
						if(i==1)
						{
							if(item3[1].hasAttribute == 'ng-if'){
								return item3[2].innerText;
							}
							else
								return item3[1].innerText;
						}
					}
				}, Contact_Details_Selector_Class);
				let retailerWebsiteDetails = await page1.evaluate((sel) => {
					let result=[];
					let item3 = document.querySelectorAll(sel);
					for(var i =0;i<item3.length;i++)
					{	
						var str = item3[i].innerText;
						if(item3[i].getAttribute('ng-if')=="vm.exhibitor.webSite" )
						{
							var Website=str.substr(9);
							return Website;
							/*result.push({
								Website: Website,
							});*/
						}
						else
							continue;
					}
				}, Contact_Details_Selector_Class);
				let retailerPhoneDetails = await page1.evaluate((sel) => {
					let result=[];
					let item3 = document.querySelectorAll(sel);
					for(var i =0;i<item3.length;i++)
					{	
						var str = item3[i].innerText;
						if(str.includes("phone: "))
						{
							var Phone=str.substr(7);
							return Phone;
							/*result.push({
								Phone: Phone,
							});*/
						}
						else
							continue;
					}
				}, Contact_Details_Selector_Class);
				
				// Comment retailerCategory block below if you do not need Category
				
				let retailerCategory= await page1.evaluate((sel) => {
					let result=[];
					let item4=document.querySelectorAll(sel);
					for(var i=0; i<item4.length;i++)
					{
						if(item4[i].hasAttribute('ng-repeat'))
						{
							if(item4[i].getAttribute('ng-repeat')=="cat in vm.categories")
							{	
								
								result.push({
									category: item4[i].innerText,
								});
							}
							else
								continue;
						}
					}
					return result;
				},Category_Selector_Class);
				
				// Remove Comments below if you need Product Lines 
				
				/*let retailerCategory= await page1.evaluate((sel) => {
					let result=[];
					let item5=document.querySelectorAll(sel);
					for(var i=0; i<item5.length;i++)
					{
						if(item5[i].hasAttribute('ng-repeat'))
						{
							if(item5[i].getAttribute('ng-repeat')=="line in vm.productLines")
							{	
								result.push({
									ProductLines: item5[i].innerText,
								})
							}
						}
					}
					return result;
				},Category_Selector_Class);
				*/

				var retailerObject=[];
				retailerObject =  {
					id: retailerCount,
					url: retailer,
					name: retailerName,
					description: retailerDescription,
					website: retailerWebsiteDetails,
					facebook_Handle: retailerFBHandle,
					instagram_Handle: retailerInstagramHandle,
					pinterest_Handle: retailerPinterestHandle,
					emailAddress: retailerEmailHandle,
					contactPerson: retailerEmailHandlerName,
					phone: retailerPhoneDetails,
					address: retailerAddressDetails,
					city: retailerCityDetails,
					categories: retailerCategory
				};

				//Dump Outputs in a file
				fs.appendFile('Output1.json', `, ${JSON.stringify(retailerObject, null, 2)}`, function (err) {
					if (err) throw err;
						console.log('....');
				});
				
				console.log(`, ${JSON.stringify(retailerObject, null, 2)}`);
				var DistinguishLine="--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
				console.log(DistinguishLine);
				
				await page1.waitFor(3000);
				retailerCount++;
			}
			console.log("Completed");
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
runRetailer().then(console.log).catch(console.error);