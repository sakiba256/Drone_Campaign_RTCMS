const { expect } = require('@playwright/test');
const fs = require('fs');
const csv = require('csv-parser');
const ReportGenerator = require('./reportGenerate.spec');

class Drone {
  constructor(page) {
    this.page = page;
    this.report = new ReportGenerator();
  }
  async create(aData, cData) {
    console.log("Start to create a Drone Campaign");
    await this.page.waitForTimeout(4000);
    // Handle Drone Admin creation
    
    // const droneAdmin = await this.page.locator('//span[normalize-space()="Drone Admin"]');
    // await droneAdmin.click();
    const droneAdmin = await this.page.waitForSelector('//span[normalize-space()="Drone Admin"]', { state: 'visible' });
    await droneAdmin.click();

    await this.page.waitForTimeout(4000);
    console.log("Drone Admin");
    await this.page.reload();
    await this.page.waitForTimeout(4000);
    await this.page.reload();
    await this.page.waitForTimeout(2000);
    for (const data of aData) {
      try {
        const element = await this.page.locator('//a[@class="nav-link active"]//span[contains(text(),"Drone Admin")]');
        await element.click();
        await this.page.waitForTimeout(1000);
  
        const aObj = data.Objective || 'CSV file value not found'; // Fallback if missing
        const aSrv = data.Service || 'CSV file value not found'; // Fallback if missing
        const aName= data.Name || 'CSV file value not found';
        await this.addDroneAdmin(aName,aObj, aSrv);
        console.log(aName+ " Campaign in Admin Created and Submitted Successfully!");
      } 
      catch (error) {
        const aName= data.Name || 'CSV file value not found';
        console.error(`Error while creating Drone Admin: ${error.message}`);
        const screenshotPath = `./Screenshots/error-drone-admin-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken for Drone Admin error: ${screenshotPath}`);
        //console.log(aSrv);
        this.report.logResult(aName+ " Drone Admin Creation failed", "FAILED", error.message);

      }
    }
  
    // Handle Drone Campaign creation
    
    
    for (const data of cData) {
      try {
        const droneCampaign = await this.page.locator('//span[normalize-space()="Drone Campaign"]');
        await droneCampaign.click();
        //const element = await this.page.locator('//a[@class="nav-link active"]//span[contains(text(),"Drone Campaign")]');
        //await element.click();
        await this.page.waitForTimeout(1000);
  
        const cName = data.Name || 'CSV file value not found'; // Fallback if missing
        const cObj = data.Objective || 'CSV file value not found'; // Fallback if missing
        const cSrv = data.Service || 'CSV file value not found'; // Fallback if missing
  
        await this.addDroneCampaign(cName, cObj, cSrv);
        this.report.logResult(cName+ " Campaign Created Successfully", "PASSED");
      } catch (error) {
        const cName = data.Name || 'CSV file value not found';
        console.error(`Error in catch Block creating Drone Campaign: ${error.message}`);
        const screenshotPath = `./Screenshots/error-drone-campaign-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken for Drone Campaign error: ${screenshotPath}`);
        this.report.logResult(cName+ " Campaign Creation failed", "FAILED", error.message);
      }
    }
    await this.generateReport();
  }
  
  
  // Other methods in Milestone class will remain the same
  async addDroneAdmin(aName,aObj,aSrv) {
    console.log('Drone Admin Page is showing');
    await this.page.waitForTimeout(3000);

    const Obj = await this.page.locator('select[name="objective"]');

    await Obj.selectOption({ value: aObj });
    await this.page.waitForTimeout(1000);  
        
    const Ser = await this.page.locator('select[name="serviceTypeCode"]');

    //await this.page.waitForTimeout(2000);
    console.log(aSrv);
    await Ser.selectOption({ label: aSrv });
    
    await this.page.waitForTimeout(1000);
     
    // const Aud = await this.page.locator('select[name="audienceId"]');

    // await Aud.selectOption({ value: '2470' });
    const Aud = await this.page.locator('select[name="audienceId"]');
    await Aud.selectOption({ index: 1 }); // Selects the first valid option

    await this.page.waitForTimeout(1000);

      
    const asubmit = await this.page.locator('//button[normalize-space()="Submit"]');
    await asubmit.click();
    await this.page.waitForTimeout(3000);  
    
    const element = await this.page.locator('//span[@id="client-snackbar"]');
    const isVisible = await element.isVisible();
    if (isVisible) {
        console.log("Error is showing");
        console.error(`Error while creating Drone Admin: ${error.message}`);
        const screenshotPath = `./Screenshots/error-audience-builder-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });  // Ensure full-page screenshot
        console.log(`Screenshot taken for Audience Builder error: ${screenshotPath}`);
        this.report.logResult(aName + " Drone Admin Creation failed", "FAILED", error.message);

    }
    else {
        console.log("Drone Admin Combination Submitted Succesfully");
        this.report.logResult(aName + " Drone Admin Combination Submitted Succesfull", "PASSED", error.message);

        
      }

  }

  async addDroneCampaign(cName,cObj,cSrv) {
    console.log('Add Drone Campaign Page is showing');
    await this.page.waitForTimeout(4000);  
    await this.page.fill('//input[@placeholder="Campaign Name"]', cName);
    await this.page.waitForTimeout(3000);  

    const Obj = await this.page.locator('select[name="objective"]');

    await Obj.selectOption({ value: cObj });
    await this.page.waitForTimeout(1000);  
        
    const Ser = await this.page.locator('select[name="serviceTypeCode"]');
    await Ser.selectOption({ label: cSrv });
    
    await this.page.waitForTimeout(1000);
  

   // Get the current date
    const now = new Date();

    // Add one day to the current date
    now.setDate(now.getDate() + 1);

    // Format the date as YYYY-MM-DD 00:00:00
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} 00:00:00`;

    // Use this formatted date in the page.fill function
    await this.page.fill('//input[@name="startDate"]', formattedDate);


    await this.page.waitForTimeout(1000);

    await this.page.waitForTimeout(1000);
    
    // Get the current date
    const now1 = new Date();

    // Add 10 days to the current date
    now1.setDate(now1.getDate() + 10);

    // Format the date as YYYY-MM-DD 23:59:59
    const year1 = now1.getFullYear();
    const month1 = String(now1.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day1 = String(now1.getDate()).padStart(2, '0');
    const formattedDate1 = `${year1}-${month1}-${day1} 23:59:59`;

    // Use this formatted date in the page.fill function
    await this.page.fill('//input[@name="endDate"]', formattedDate1);

    await this.page.waitForTimeout(1000);
    await this.page.fill('//input[@placeholder="Campaign Budget"]', '2600000');
    await this.page.waitForTimeout(1000);
    
    const DM = await this.page.locator('select[name="cpsConfigId"]');
    await this.page.waitForTimeout(2000);

    await DM.selectOption({ value: '1' });
    await this.page.waitForTimeout(2000);
    const nxt= await this.page.locator('//button[normalize-space()="Next"]');
    await nxt.click();
    
    await this.page.waitForTimeout(2000);
    const submitCampaign= await this.page.locator('//button[normalize-space()="Submit Campaign"]');
    await submitCampaign.click();
    
    await this.page.waitForTimeout(2000);
    const aTicket = await this.page.locator('select[name="template"]');
    await aTicket.selectOption({ value: '30307' });
    await this.page.waitForTimeout(2000);
    
    const save= await this.page.locator('//button[normalize-space()="Save"]');
    await save.click();
    await this.page.waitForTimeout(3000);
    
    const submit= await this.page.locator('//button[normalize-space()="Submit"]');
    await submit.click();
    await this.page.waitForTimeout(4000);
    // Validate Campaign Created successfully
    const pageText = await this.page.innerText('body');
    if (pageText.includes(cName)) {
      console.log(cName + " Campaign has Created Successfully. ✅ Validation Passed");

    } else {
        throw new Error("❌ Validation Failed: Campaign hasn't created.");
    }
    await this.page.waitForTimeout(2000);


  }

  async generateReport() {
    this.report.saveTestReport(); 
  }
  

}

module.exports = Drone;



