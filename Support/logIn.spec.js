
class LogIn {
    constructor(page) {
      this.page = page;
    }
  
    async logInPortal() {
      console.log("Searching for product...");
      {
        try
        {
          const element = await this.page.locator('//input[@id="i0116"]');
          await element.click();
          await this.page.fill('//input[@id="i0116"]', '//UserName');
          const next = await this.page.locator('//input[@id="idSIButton9"]');
          await next.click();
          await this.page.fill('//input[@id="i0116"]', '//UserName');
          const pass = await this.page.locator('//input[@id="i0118"]');
          await pass.click();
          await this.page.fill('//input[@id="i0118"]', '//Password');

          const signIn = await this.page.locator('//input[@id="idSIButton9"]');
          await signIn.click();
          const yesbutton = await this.page.locator('#idSIButton9');
          await yesbutton.click();
        } catch (error) {
          console.error("An error occurred:", error.message);
          const screenshotPath = `./Screenshots/error-screenshot-${Date.now()}.png`;
          await this.page.screenshot({ path: screenshotPath });
          console.log(`Screenshot taken: ${screenshotPath}`);
      
          // Optionally, rethrow the error if you want to fail the test
          throw error;
      }
    }   
   }
  }
  
  module.exports = LogIn;
  