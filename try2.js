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
					return document.querySelector(sel).innerText;
				}, Description_Selector_Class)
			
				//Push Social Media Handles into an array
				let retailerSocialMedia = await page1.evaluate((sel) => {
					let result=[];
					let item2 = document.querySelectorAll(sel);
					item2.forEach((item) => {
						// Check if its FB Handle, Push it with Fb headline in Social Media Handles Array 
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("facebook")) )
						{
							result.push({	
								fb: item.getAttribute('href'),
							});
						}
						// Check if its Instagram Handle, Push it with Instagram headline in Social Media Handles Array		
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("instagram")) )
						{
							result.push({	
								instagram: item.getAttribute('href'),
							});
						}	
						
						//Remove Comment if You need Twitter Details
						// Check if its Twitter Handle, Push it with Twitter headline in Social Media Handles Array		
						/*if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("twitter")) )
						{
							result.push({	
								twitter: item.getAttribute('href'),
							});
						}*/	
						
						// Check if its Pinterest Handle, Push it with Pinterest headline in Social Media Handles Array		
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("pinterest")) )
						{
							result.push({	
								pinterest: item.getAttribute('href'),
							});
						}
						// Check if its Email Handle, Push it with Email headline in Social Media Handles Array			
						if((item.getAttribute('href')!= null) && (item.getAttribute('href').includes("mailto")) && (item.getAttribute('href')!="mailto:") )
						{
							var str=item.getAttribute('href');
							var Email= str.substr(7);
							result.push({	
								Email: Email,
								// Show Contact Person Name as well along with email address 
								ContactPerson: item.innerText,
							});
						}	
					});
					
					return result;
				},Social_Media_Selector_Class);
				
				//Push Basic Contact Details in an array
				let retailerContactDetails = await page1.evaluate((sel) => {
					let result=[];
					let item3 = document.querySelectorAll(sel);
					
					/* Check what all details retailer have mentioned on America's Mart and 
					push them in an array along with corresponding heading*/
					for(var i =0;i<item3.length;i++)
					{	var str = item3[i].innerText;
						
						if(item3[i].hasAttribute('ng-if'))
						{
							if(item3[i].getAttribute('ng-if') == "vm.exhibitor.address2")
							{
								result.push({
									Address2: item3[i].innerText,
								});
							}
							else if(item3[i].getAttribute('ng-if')=="vm.exhibitor.webSite" )
							{
								var Website=str.substr(9);
								result.push({
									Website: Website,
								});
							}
						}
						else if(str.includes("phone: "))
						{
							var Phone=str.substr(7);
							result.push({
								Phone: Phone,
							});
						}
						else
						{
							if(i==0)
							{	
								result.push({
									Address1: item3[i].innerText,
								});
							}
							if(i==1 || i==2)
							{	
								result.push({
									City: item3[i].innerText,
								});
							}
						}
					}	
					return result;
				},Contact_Details_Selector_Class );
				
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
									Category: item4[i].innerText,
								})
							}
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

				//Print all the detailes fetched and stored in arrays
				await page1.waitFor('h4.amc-gray-7.bold');
				console.log("Retailer No.", retailerCount+" :");
				console.log("Name:", retailerName);
				console.log("Description:", retailerDescription);
				console.log("\n");
				console.log("URL:", retailer);
				console.log("Social Media Details:");
				console.log(retailerSocialMedia);
				console.log("Contact Details: ");
				console.log(retailerContactDetails);
				console.log("Categories: ");
				console.log(retailerCategory);
				// Remove comments below to print Product Lines
				/*console.log("Categories: ");
				console.log(retailerCategory);*/
				
				var DistinguishLine="--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
				console.log(DistinguishLine);
				
				//Dump Outputs in a file
				fs.appendFile('Output.json',"Retailer No."+retailerCount+" :\nName:"+retailerName+"\n\nDescription:"+retailerDescription+"\n\nURL:"+retailer+"\n\nSocial Media Details:\n"+JSON.stringify(retailerSocialMedia)+"\n\nContact Details:\n"+JSON.stringify(retailerContactDetails)+"\n\nCategories:\n"+JSON.stringify(retailerCategory)+"\n"+DistinguishLine, function (err) {
					if (err) throw err;
						console.log('....');
				});/*
				fs.appendFile('Output.json',"Name:"+retailerName+"\n", function (err) {
					if (err) throw err;
						console.log('The "data to append" was appended to file!');
				});
				fs.appendFile('Output.json',"Name:"+retailerName+"\n", function (err) {
					if (err) throw err;
						console.log('The "data to append" was appended to file!');
				});
				*/
				
				
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