const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  runScraper: async (pages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering) => {
    console.log("Preload - sending pages:", pages, "type:", typeof pages);
    // Ensure pages is a number before sending
    const numPages = Number(pages);
    if (!Number.isFinite(numPages)) {
      throw new Error("Invalid page count");
    }
    console.log(responsivenesssFiltering)
    return await ipcRenderer.invoke("run-scraper", numPages, colorFiltering, responsivenesssFiltering, seoFiltering, seoMaximum, performanceFiltering, performanceMaximum, accessibilityFiltering, accessibilityMaximum, bestPracticesFiltering, bestPracticesMaximum, languageFiltering);
  },
  getResults: async () => {
    return await ipcRenderer.invoke("get-results");
  },
});