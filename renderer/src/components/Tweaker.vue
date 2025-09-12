<template>
  <div class="flex flex-col h-screen max-h-screen text-white text-base">
      <!-- Navigation section -->
       <div class="flex w-full bg-github-lightgray-background">
            <router-link to="/website/about:blank" class="flex flex-1 justify-center px-4 py-2 border border-github-black-border" :class="[isActiveLink('/website/about:blank') ? 'border-b-4 border-b-github-blue-border/background' : '']">
                <div>Website</div>
            </router-link>
            <router-link to="/manager" class="flex flex-1 justify-center px-4 py-2 border border-github-black-border" :class="[isActiveLink('/manager') ? 'border-b-4 border-b-github-blue-border/background' : '']">
                <div>Manager</div>
            </router-link>
       </div>
      <!-- Results section -->
      <div class="flex-1 min-h-0 p-4 text-white border border-github-black-border flex flex-col">
          <h2 class="text-lg font-bold mb-4 flex-none">Scraper Results:</h2>
          
          <!-- Content container that takes remaining height -->
          <div class="flex-1 min-h-0 relative">
              <div 
                  v-if="!scraping && results.length === 0" 
                  class="absolute inset-0 flex justify-center"
              >
                  <p>No results yet. Run the scraper to see results.</p>
              </div>
      
              <div 
                  v-if="results.length > 0" 
                  class="absolute inset-0 overflow-auto pr-4"
              >
                  <ul>
                      <li v-for="(result, index) in results" :key="index" class="border border-github-black-border p-4">
                          <div class="flex items-center">
                              <strong class="shrink-0 mr-2">URL:</strong> 
                              <a href="#"  @click.prevent="navigateToWebsite(result.url)" class="text-blue-400 hover:underline truncate block" :title="result.url">{{ result.url }}</a>
                          </div>
                          <div><strong>Issues:</strong> {{ result.issues.join(", ") }}</div>
                      </li>
                  </ul>
              </div>
          </div>
      </div>

      <!-- Form section -->
      <div class="p-4 bg-github-gray-background border border-github-black-border">
        <div class="flex flex-row justify-between">
            <h2 class="mb-4 text-2xl font-bold">Tweaker:</h2>
            <div class="flex">
                <v-progress-circular
                    v-if="scraping"
                    indeterminate
                    color="primary"
                    size="26"
                    class="mt-1 mr-3"
                ></v-progress-circular>
                <div class="flex items-center bg-github-dark-background rounded border-2 border-github-gray-border py-0 h-10">
                
                    <div class="bg-github-gray-background h-full flex items-center px-2 border-r-2 border-github-gray-border">
                        #
                    </div>
                    <input 
                        type="number" 
                        v-model.number="pagesAmount" 
                        min="1"
                        class="py-1 px-2 rounded w-12 border-none focus:border-none"
                        placeholder=""
                    >
                    </div>
                </div>
            </div>    
          <form class="space-y-4">
              <div class="flex flex-col space-y-2">
                  
                  <h2  class="font-bold text-lg">Filters:</h2>
                  <div class="flex space-x-4 w-full">
                      <div class="items-center rounded py-0 h-10 flex-1 flex flex-row space-x-4">
                          <label class="bg-github-gray-background h-full flex items-center px-2 rounded border-2 border-github-gray-border text-nowrap flex-3" for="colorFiltering" title="Color filtering">Color:</label>
                          <input 
                              type="checkbox" 
                              v-model="colorFiltering" 
                              class="rounded min-h-full flex-1"
                          >
                      </div>
                      <div class="rounded-xl min-w-px min-h-4 bg-github-gray-text space-x-4"></div>
                      <div class="items-center rounded py-0 h-10 flex-1 flex flex-row space-x-4">
                          <label class="bg-github-gray-background h-full flex items-center px-2 rounded border-2 border-github-gray-border text-nowrap flex-3" for="responsivnessFiltering" title="Responsiveness filtering">Responsive:</label>
                          <input 
                              type="checkbox" 
                              v-model="responsivenessFiltering"
                              class="rounded min-h-full flex-1"
                          >
                      </div>
                  </div>
                  <div class="flex flex-row space-x-4">
                    <div class="flex flex-10 items-center bg-github-dark-background rounded border-2 border-github-gray-border py-0 h-10">
                        <label class="bg-github-gray-background h-full flex items-center px-2 border-r-2 border-github-gray-border text-nowrap" for="performanceFiltering">SEO Max:</label>
                        <input 
                          type="number" 
                          v-model.number="seoMaximum"
                          class="py-1 px-2 rounded w-12 border-none focus:border-none"
                        >
                    </div>
                    <input 
                          type="checkbox" 
                          v-model.number="seoFiltering"
                          class="w-6 rounded flex-1"
                          placeholder="SEO threshold"
                    >
                  </div>
                  <div class="flex flex-row space-x-4">
                    <div class="flex flex-10 items-center bg-github-dark-background rounded border-2 border-github-gray-border py-0 h-10">
                        <label class="bg-github-gray-background h-full flex items-center px-2 border-r-2 border-github-gray-border text-nowrap" for="performanceFiltering">Performance Max:</label>
                        <input 
                          type="number" 
                          v-model.number="performanceMaximum"
                          class="py-1 px-2 rounded w-12 border-none focus:border-none"
                        >
                    </div>
                    <input 
                          type="checkbox" 
                          v-model.number="performanceFiltering"
                          class="w-6 rounded flex-1"
                          placeholder="SEO threshold"
                    >
                  </div>
                  <div class="flex flex-row space-x-4">
                    <div class="flex flex-10 items-center bg-github-dark-background rounded border-2 border-github-gray-border py-0 h-10">
                        <label class="bg-github-gray-background h-full flex items-center px-2 border-r-2 border-github-gray-border text-nowrap" for="performanceFiltering">Accessibility Max:</label>
                        <input 
                          type="number" 
                          v-model.number="accessibilityMaximum"
                          class="py-1 px-2 rounded w-12 border-none focus:border-none"
                        >
                    </div>
                    <input 
                          type="checkbox" 
                          v-model.number="accessibilityFiltering"
                          class="w-6 rounded flex-1"
                          placeholder="SEO threshold"
                    >
                  </div>
                  <div class="flex flex-row space-x-4">
                    <div class="flex flex-10 items-center bg-github-dark-background rounded border-2 border-github-gray-border py-0 h-10">
                        <label class="bg-github-gray-background h-full flex items-center px-2 border-r-2 border-github-gray-border text-nowrap" for="performanceFiltering">Best Practices Max:</label>
                        <input 
                          type="number" 
                          v-model.number="bestPracticesMaximum"
                          class="py-1 px-2 rounded w-12 border-none focus:border-none"
                        >
                    </div>
                    <input 
                          type="checkbox" 
                          v-model.number="bestPracticesFiltering"
                          class="w-6 rounded flex-1"
                          placeholder="SEO threshold"
                    >
                  </div>
              </div>
              <button 
                  @click.prevent="startScraper"
                  v-if="!scraping"
                  class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Start Scraper
              </button>
              <button 
                  v-if="scraping"
                  class="w-full bg-blue-950 text-gray-400 px-4 py-2 rounded"
                >
                  Start Scraper
              </button>
          </form>
      </div>
  </div>
</template>


<script setup>
import animationData from '../assets/loading_results.json'
import { onMounted, ref } from "vue"
import { RouterLink, useRouter, useRoute } from 'vue-router';

const results = ref([]);
const pagesAmount = ref(1);
const colorFiltering = ref(false);
const responsivenessFiltering = ref(false);
const seoFiltering = ref(true);
const seoMaximum = ref(30);
const performanceFiltering = ref(true);
const performanceMaximum = ref(30);
const accessibilityFiltering = ref(true);
const accessibilityMaximum = ref(30);
const bestPracticesFiltering = ref(true);
const bestPracticesMaximum = ref(30);

const scraping = ref(false);

const router = useRouter();

const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
}

onMounted(async ()=>{
    try {
        await fetchResults();
    } catch(e) {
        console.log("There has been an error fetching the results on mount:" + e)
    }
})

const navigateToWebsite = (url) => {
    const encodedUrl = encodeURIComponent(url);
    router.push({ 
        name: 'website', 
        params: { url: encodedUrl }
    });
};

const startScraper = async () => {
  try {
    // Add validation
    if (!Number.isInteger(pagesAmount.value) || pagesAmount.value < 1) {
      alert("Please enter a valid number of pages (minimum 1)");
      return;
    }
    scraping.value = true;
    console.log("Starting scraper with pages:", pagesAmount.value, colorFiltering.value, responsivenessFiltering.value, seoFiltering.value, seoMaximum.value, performanceFiltering.value, performanceMaximum.value, accessibilityFiltering.value, accessibilityMaximum.value, bestPracticesFiltering.value, bestPracticesMaximum.value); // Debug log
    const response = await window.api.runScraper(pagesAmount.value, colorFiltering.value, responsivenessFiltering.value, seoFiltering.value, seoMaximum.value, performanceFiltering.value, performanceMaximum.value, accessibilityFiltering.value, accessibilityMaximum.value, bestPracticesFiltering.value, bestPracticesMaximum.value);
    if (response.status === "success") {
      await fetchResults();
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error("Error starting scraper:", error);
    alert("Failed to start the scraper. Check console for details.");
  } finally {
    scraping.value = false
  }
}

const fetchResults = async () => {
  try {
    const data = await window.api.getResults();
    console.log("Fetched data:", data);
    results.value = data;
  } catch (error) {
    console.error("Error fetching results:", error);
    alert("Failed to fetch results. Check console for details.");
  }
}
</script>

