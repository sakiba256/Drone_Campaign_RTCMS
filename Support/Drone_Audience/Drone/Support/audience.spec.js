const { expect } = require('@playwright/test');
const fs = require('fs');
const csv = require('csv-parser');

class Audience {
  constructor(page) {
    this.page = page;
  }
  async  addAudience () {
    console.log("Start to create Audeince");
  
    // Handle Drone Admin creation
    
    const audienceBuilder = await this.page.locator('a[href="/audience-builder"]');
    await audienceBuilder.click();
    await this.page.waitForTimeout(1000);

   
      try {
        await this.page.fill('//input[@placeholder="Audience Name"]', '103. SNS Automated Audience');
        await this.page.waitForTimeout(1000);
  
        // const aObj = data.Objective || 'CSV file value not found'; // Fallback if missing
        // const aSrv = data.Service || 'CSV file value not found'; // Fallback if missing
  
        await this.page.fill('//input[@placeholder="Description"]', '103. SNS Automated Audience');
        await this.page.waitForTimeout(1000);
        const aType = await this.page.locator('//select[@name="audienceType"]');

        await aType.selectOption({ value: 'FIXED' });
        await this.page.waitForTimeout(1000);
        
        const bTag = await this.page.locator('//select[@name="balanceTagOperator"]');

        await bTag.selectOption({ value: '=' });
        await this.page.waitForTimeout(2000);
        await this.page.fill('//input[@placeholder="Amount"]', '200');
        await this.page.waitForTimeout(2000);
        const fNext = await this.page.locator('//button[normalize-space()="Next"]');
        await fNext.click();
        await this.page.waitForTimeout(2000);
        const sNext = await this.page.locator('//button[normalize-space()="Next"]');
        await sNext.click();
        await this.page.waitForTimeout(2000);
        const tNext = await this.page.locator('//button[normalize-space()="Next"]');
        await tNext.click();
        await this.page.waitForTimeout(2000);
        const rNext = await this.page.locator('//button[normalize-space()="Next"]');
        await rNext.click();
        await this.page.waitForTimeout(2000);
        const vNext = await this.page.locator('//button[normalize-space()="Next"]');
        await vNext.click();
       
        await this.page.waitForTimeout(2000);
        const exe = await this.page.locator('//button[normalize-space()="Execute"]');
        await exe.click()
        await this.page.waitForTimeout(2000);
        console.log('Audience Create Successfully');

        // Job Status Chaned to Submitted to Ended, wait for that

        while (true) {
          await this.page.reload(); // Refresh the page
          await this.page.waitForTimeout(2000); // Wait a bit

          const statusText = await this.page.locator('//tr/td[5]').first().textContent();

          if (statusText && statusText.trim() === "ENDED") {
              console.log("✅ Job Status changed to ENDED");
              break; // Exit loop when status is "ENDED"
          }

          console.log("⏳ Waiting for Job Status to change from Submitted to ENDED after creating the Audience...");
       }



        //Submit Audience
        await this.page.waitForTimeout(3000);
        const aSubmit = await this.page.locator('//tbody/tr[1]/td[7]/div[1]/button[4]');
        await aSubmit.click()
        await this.page.waitForTimeout(3000);
        await this.page.fill('//input[@placeholder="TG"]', '90');
        await this.page.waitForTimeout(2000);

        const finalSubmit = await this.page.locator('//button[@type="submit"][normalize-space()="Submit"]');
        await finalSubmit.click()
        await this.page.waitForTimeout(3000);


      } catch (error) {
        console.error(`Error while creating Drone Admin: ${error.message}`);
        const screenshotPath = `./Screenshots/error-drone-admin-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken for Drone Admin error: ${screenshotPath}`);
      }
  }
  

  }


module.exports = Audience;



