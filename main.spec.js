const { chromium } = require('@playwright/test');
const LogIn = require('./Support/logIn.spec'); // Import the LogIn class
const Milestone = require('./Support/drone.spec');
const fs = require('fs');
const csv = require('csv-parser');  // CSV parser module
const Drone = require('./Support/drone.spec');
const Audience = require('./Support/audience.spec');
const { log } = require('console');

(async () => {
  // Launch Chrome in non-headless mode
  const browser = await chromium.launch({
    headless: false, // Set to false for UI mode
    channel: 'chrome', // Use Chrome browser
    args: ['--start-maximized']
  });

  // Create a new browser context with viewport set to null
  const context = await browser.newContext({
    viewport: null, // Allow the browser to use the full screen
  });

  // Create a page from the context
  const page = await context.newPage();

  // Navigate to the website
  await page.goto('//URL');

  // Initialize the LogIn and Milestone classes
  const logIn = new LogIn(page);
  const drone = new Drone(page);
  const aud=new Audience(page)

  // Call the logInPortal method
  await logIn.logInPortal();

  // Read the CSV file and pass the data to the milestone creation process
  const aData = await readCSV('./dAdmin.csv');  
  const cData = await readCSV('./dCampaign.csv');  
  console.log(aData);
  console.log(cData);

  // Create Audience from audience builder
  await aud.addAudience();
  // Create a drone campaign using the CSV data
  await drone.create(aData,cData);

  console.log("Testing Done sucessfully");
  // Close the browser
  await page.waitForTimeout(8000);
  await browser.close();
})();

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = []; // Array to store parsed CSV data

    fs.createReadStream(filePath) // Create a readable stream for the file
      .pipe(csv()) // Parse the CSV content
      .on('data', (data) => {
        // Check if 'Name' exists and handle optional 'Base'
        if (data.Name) {
          results.push({
            Name: data.Name ? data.Name.trim(): null,
            Objective: data.Objective ? data.Objective.trim() : null, 
            Service: data.Service ? data.Service.trim() : null, 

          });
        }
      })
      .on('end', () => resolve(results)) // Resolve the promise with the results array
      .on('error', (err) => reject(err)); // Reject the promise if an error occurs
  });
}

