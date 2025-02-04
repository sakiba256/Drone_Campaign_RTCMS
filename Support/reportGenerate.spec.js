const fs = require('fs');

class ReportGenerator {
  constructor() {
    this.testResults = []; // Store test results in an array
  }

  logResult(testCase, status, errorMessage = "") {
    this.testResults.push({
      testCase,
      status,
      errorMessage,
      timestamp: new Date().toISOString(),
    });
  }

  saveTestReport() {
    const reportFile = "./test-report.html";
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Report</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; background-color: #f4f4f4; }
              h1 { text-align: center; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
              th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
              th { background: #007bff; color: white; }
              tr:nth-child(even) { background: #f2f2f2; }
              .passed { color: green; font-weight: bold; }
              .failed { color: red; font-weight: bold; }
          </style>
      </head>
      <body>
          <h1>Test Execution Report</h1>
          <table>
              <tr>
                  <th>Test Case</th>
                  <th>Status</th>
                  <th>Error Message</th>
                  <th>Timestamp</th>
              </tr>
              ${this.testResults.map(result => `
                  <tr>
                      <td>${result.testCase}</td>
                      <td class="${result.status.toLowerCase()}">${result.status}</td>
                      <td>${result.errorMessage || 'N/A'}</td>
                      <td>${result.timestamp}</td>
                  </tr>
              `).join("")}
          </table>
      </body>
      </html>
    `;

    fs.writeFileSync(reportFile, htmlContent);
    console.log(`Test report saved to ${reportFile}`);
  }
}

module.exports = ReportGenerator;
