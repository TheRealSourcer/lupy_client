const { app, BrowserWindow, ipcMain, Menu, Notification } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const isMac = process.platform === "darwin";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Lupy",
    width: 1000,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"), // Ensure this path is correct
    },
  });

  if (process.env.NODE_ENV !== "production") {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  }
}

// Handle running the scraper
ipcMain.handle("run-scraper", async (event, pages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering) => {
  try {
    const result = await runScraper(pages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering);
    return result;
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});



// **This is the missing handler for 'get-results'**
ipcMain.handle("get-results", async () => {
  try {
    const results = await readResults();
    return results;
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});

function createContactWindow() {
  const contactWindow = new BrowserWindow({
    title: "Lupy",
    width: 1000,
    height: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // Ensure this path is correct
    },
  })
  if (process.env.NODE_ENV !== "production") {
    contactWindow.webContents.openDevTools();
    contactWindow.loadURL("https://localhost:5173");
  } else {
    contactWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  }
}

app.whenReady().then(() => {
  

  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

const menu = []

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function runScraper(pages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering) {
  const settingsPath = 'C:/Users/Vicenzzz/seo_design_crawler/seo_design_crawler/settings.py';
  return new Promise((resolve, reject) => {
    // Validate pages parameter
    const pageCount = parseInt(pages);
    if (isNaN(pageCount) || pageCount < 1) {
      reject(new Error(`Invalid page count: ${pageCount}. Must be a positive number.`));
      return;
    }
    try {
      let data = fs.readFileSync(settingsPath, 'utf8');
      
      // Log the value being written to the settings file
      console.log("Writing to settings file, pageCount:", pageCount);
      
      const capitalizeBoolean = (bool) => bool.toString().charAt(0).toUpperCase() + bool.toString().slice(1);
      
      const pageCountSetting = `CLOSESPIDER_PAGECOUNT = ${pageCount}`;
      const colorFilteringSetting = `COLOR_FILTERING = ${capitalizeBoolean(colorFiltering)}`;
      const responsivenesssFilteringSetting = `RESPONSIVENESS_FILTERING = ${capitalizeBoolean(responsivenesssFiltering)}`;
      const seoFilteringSetting = `SEO_FILTERING = ${seoFiltering}`;
      const seoMaximumSetting = `SEO_MAXIMUM = ${seoMaximum}`;
      const performanceFilteringSetting = `PERFORMANCE_FILTERING = ${performanceFiltering}`;
      const performanceMaximumSetting  = `PERFORMANCE_MAXIMUM = ${performanceMaximum}`;
      const accessibilityFilteringSetting = `ACCESSIBILITY_FILTERING = ${accessibilityFiltering}`;
      const accessibilityMaximumSetting = `ACCESSIBILITY_MAXIMUM = ${accessibilityMaximum}`;
      const bestPracticesFilteringSetting = `BEST_PRACTICES_FILTERING = ${bestPracticesFiltering}`;
      const bestPracticesMaximumSetting = `BEST_PRACTICES_MAXIMUM = ${bestPracticesMaximum}`;
      const languageFilteringSetting = `LANGUAGE_FILTERING = ${languageFiltering}`;
      
      
      if (data.includes('CLOSESPIDER_PAGECOUNT')) {
        data = data.replace(/CLOSESPIDER_PAGECOUNT\s*=\s*[^\n]*/g, pageCountSetting);
      } else {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + pageCountSetting
        );
      }

      if (data.includes('COLOR_FILTERING')) {
        data = data.replace(/COLOR_FILTERING\s*=\s*[^\n]*/g, colorFilteringSetting);
      } else {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + colorFilteringSetting
        );
      }

      if (data.includes('RESPONSIVENESS_FILTERING')) {
        data = data.replace(/RESPONSIVENESS_FILTERING\s*=\s*[^\n]*/g, responsivenesssFilteringSetting);
      } else {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + responsivenesssFilteringSetting
        );
      }

      if (data.includes('SEO_MAXIMUM') && seoFiltering) {
        data = data.replace(/SEO_MAXIMUM\s*=\s*[^\n]*/g, seoMaximumSetting);
      } else if (seoFiltering) {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + seoMaximumSetting
        );
      } else if (data.includes('SEO_MAXIMUM') && !seoFiltering) {
        data = data.replace(/SEO_MAXIMUM\s*=\s*[^\n]*/g, '');
      }

      if (data.includes('PERFORMANCE_MAXIMUM') && performanceFiltering) {
        data = data.replace(/PERFORMANCE_MAXIMUM\s*=\s*[^\n]*/g, performanceMaximumSetting);
      } else if (performanceFiltering) {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + performanceMaximumSetting
        );
      } else if (data.includes('PERFORMANCE_MAXIMUM') && !performanceFiltering) {
        data = data.replace(/PERFORMANCE_MAXIMUM\s*=\s*[^\n]*/g, '');
      }

      if (data.includes('ACCESSIBILITY_MAXIMUM') && accessibilityFiltering) {
        data = data.replace(/ACCESSIBILITY_MAXIMUM\s*=\s*[^\n]*/g, accessibilityMaximumSetting);
      } else if (accessibilityFiltering) {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + accessibilityMaximumSetting
        );
      } else if (data.includes('ACCESSIBILITY_MAXIMUM') && !accessibilityFiltering) {
        data = data.replace(/ACCESSIBILITY_MAXIMUM\s*=\s*[^\n]*/g, '');
      }

      if (data.includes('BEST_PRACTICES_MAXIMUM') && bestPracticesFiltering) {
        data = data.replace(/BEST_PRACTICES_MAXIMUM\s*=\s*[^\n]*/g, bestPracticesMaximumSetting);
      } else if (bestPracticesFiltering) {
        data = data.replace(
          'BOT_NAME = "seo_design_crawler"',
          'BOT_NAME = "seo_design_crawler"\n\n' + bestPracticesMaximumSetting
        );
      } else if (data.includes('BEST_PRACTICES_MAXIMUM') && !bestPracticesFiltering) {
        data = data.replace(/BEST_PRACTICES_MAXIMUM\s*=\s*[^\n]*/g, '');
      }

      fs.writeFileSync(settingsPath, data, 'utf8');

      // Rest of your scraper code...
      const scraper = spawn('scrapy', ['crawl', 'seo_design_spider'], { 
        cwd: "C:/Users/Vicenzzz/seo_design_crawler" 
      });
      scraper.stdout.on('data', (data) => {
        console.log(`Scraper output: ${data}`);
      });

      scraper.stderr.on('data', (data) => {
        console.error(`Scraper error: ${data}`);
      });

      scraper.on('close', (code) => {
        const resultsReady = new Notification({
          title: "your results are ready",
          body: "they are pretty interesting."
        })
        if (code === 0) {
          resolve({ status: 'success', message: 'Scraper finished successfully.' });
          resultsReady.show()
        } else {
          reject(new Error('Scraper failed.'));
          resultsReady.show()
        }
      });

      // add language filtering

    } catch (error) {
      reject(new Error(`Failed to update settings file: ${error.message}`));
    }
  });
}

// Function to read the scraper results from results.json
function readResults() {
  const resultsFilePath = path.join("C:/Users/Vicenzzz/seo_design_crawler", "results.json");

  return new Promise((resolve, reject) => {
    fs.readFile(resultsFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(new Error(`Failed to read results: ${err.message}`));
      } else {
        try {
          const results = JSON.parse(data);
          resolve(results);
        } catch (parseError) {
          reject(new Error(`Failed to parse results: ${parseError.message}`));
        }
      }
    });
  });
}
