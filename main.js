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
    console.error("Error in run-scraper handler:", error);
    return { status: 'error', message: error.message };
  }
});

// This is the missing handler for 'get-results'
ipcMain.handle("get-results", async () => {
  try {
    const results = await readResults();
    return results;
  } catch (error) {
    console.error("Error in get-results handler:", error);
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
  });
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

const menu = [];

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function runScraper(pages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering) {
  // Use path.join for cross-platform compatibility
  const settingsPath = path.join(__dirname, 'seo_project', 'seo_project', 'settings.py');
  
  return new Promise((resolve, reject) => {
    // Validate pages parameter
    const pageCount = parseInt(pages);
    if (isNaN(pageCount) || pageCount < 1) {
      reject(new Error(`Invalid page count: ${pageCount}. Must be a positive number.`));
      return;
    }
    
    try {
      // Re-implementing the settings writing logic for robustness
      let data = fs.readFileSync(settingsPath, 'utf8');
      const lines = data.split('\n');
      const settingsMap = new Map();

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const parts = trimmedLine.split('=');
          if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            settingsMap.set(key, value);
          }
        }
      }

      const capitalizeBoolean = (bool) => bool.toString().charAt(0).toUpperCase() + bool.toString().slice(1);

      settingsMap.set('CLOSESPIDER_PAGECOUNT', pageCount);
      settingsMap.set('COLOR_FILTERING', capitalizeBoolean(colorFiltering));
      settingsMap.set('RESPONSIVENESS_FILTERING', capitalizeBoolean(responsivenesssFiltering));
      settingsMap.set('SEO_FILTERING', capitalizeBoolean(seoFiltering));
      settingsMap.set('PERFORMANCE_FILTERING', capitalizeBoolean(performanceFiltering));
      settingsMap.set('ACCESSIBILITY_FILTERING', capitalizeBoolean(accessibilityFiltering));
      settingsMap.set('BEST_PRACTICES_FILTERING', capitalizeBoolean(bestPracticesFiltering));
      settingsMap.set('LANGUAGE_FILTERING', `'${languageFiltering}'`);

      if (seoFiltering) settingsMap.set('SEO_MAXIMUM', seoMaximum);
      else settingsMap.delete('SEO_MAXIMUM');
      
      if (performanceFiltering) settingsMap.set('PERFORMANCE_MAXIMUM', performanceMaximum);
      else settingsMap.delete('PERFORMANCE_MAXIMUM');
      
      if (accessibilityFiltering) settingsMap.set('ACCESSIBILITY_MAXIMUM', accessibilityMaximum);
      else settingsMap.delete('ACCESSIBILITY_MAXIMUM');
      
      if (bestPracticesFiltering) settingsMap.set('BEST_PRACTICES_MAXIMUM', bestPracticesMaximum);
      else settingsMap.delete('BEST_PRACTICES_MAXIMUM');

      let newSettingsContent = '';
      let addedCustomSettings = false;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const key = trimmedLine.split('=')[0].trim();
          if (settingsMap.has(key)) {
            newSettingsContent += `${key} = ${settingsMap.get(key)}\n`;
            settingsMap.delete(key);
          } else {
            newSettingsContent += line + '\n';
          }
        } else {
            if (trimmedLine !== '') newSettingsContent += line + '\n';
        }

        if (!addedCustomSettings && trimmedLine === 'BOT_NAME = "seo_project"') {
          addedCustomSettings = true;
        }
      }

      for (const [key, value] of settingsMap) {
        newSettingsContent += `${key} = ${value}\n`;
      }

      fs.writeFileSync(settingsPath, newSettingsContent, 'utf8');

      // Adjusting paths for Linux
      const scrapyCwd = path.join(__dirname, "seo_project");
      const venvPath = path.join(__dirname, "venv");
      const pythonPath = path.join(venvPath, "bin", "python");
      const scrapyPath = path.join(venvPath, "bin", "scrapy");
      
      const scraper = spawn(pythonPath, [scrapyPath, 'crawl', 'seo_design_spider', "-O", "results.json"], { 
        cwd: scrapyCwd 
      });

      scraper.on('error', (err) => {
        console.error(`Failed to start subprocess: ${err}`);
        reject(new Error(`Failed to start the scraper. Please check your venv paths. Error: ${err.message}`));
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
        });
        if (code === 0) {
          resolve({ status: 'success', message: 'Scraper finished successfully.' });
          resultsReady.show();
        } else {
          reject(new Error('Scraper failed.'));
          resultsReady.show();
        }
      });
    } catch (error) {
      reject(new Error(`Failed to update settings file or start scraper: ${error.message}`));
    }
  });
}

// Function to read the scraper results from results.json
function readResults() {
  const resultsFilePath = path.join(__dirname, "seo_project", "results.json");

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