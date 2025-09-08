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
                  v-if="scraping" 
                  class="absolute inset-0 flex items-center justify-center"
              >
                  <lottie-player :src="animationData" autoplay loop class="w-75"/>
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
        <h2 class="mb-4 text-2xl font-bold">Tweaker:</h2>
          <form class="space-y-4">
              <div class="flex flex-col space-y-2">
                  <div class="space-y-2 flex space-x-2 items-baseline justify-between">
                      <input 
                          type="number" 
                          v-model.number="pagesAmount" 
                          min="1"
                          class="p-1 rounded w-full"
                          placeholder="Pages to scrape..."
                      >
                  </div>
                  <div class="flex space-x-2">
                      <div class="w-1/3 space-y-2 flex space-x-2 items-baseline">
                          <label class="text-sm truncate flex-1" for="colorFiltering" title="Color filtering">Color filtering:</label>
                          <input 
                              type="checkbox" 
                              v-model="colorFiltering" 
                              class="w-6 rounded flex-none"
                          >
                      </div>
                      <div class="w-1/3 space-y-2 flex space-x-2 items-baseline">
                          <label class="text-sm truncate flex-1" for="responsivnessFiltering" title="Responsiveness filtering">Responsiveness filtering:</label>
                          <input 
                              type="checkbox" 
                              v-model="responsivenessFiltering"
                              class="w-6 rounded flex-none"
                          >
                      </div>
                  </div>
                  <div class="space-y-2 flex space-x-2 items-baseline justify-between">
                      <input 
                          type="checkbox" 
                          v-model.number="seoFiltering"
                          class="w-6 rounded"
                          placeholder="SEO threshold"
                      >
                      <input 
                          type="number" 
                          v-model.number="seoMaximum"
                          class="p-1 rounded"
                      >
                  </div>
                  <div class="space-y-2 flex space-x-2 items-baseline justify-between">
                      <label class="text-sm truncate" for="performanceFiltering">Performance Max:</label>
                      <input 
                          type="checkbox" 
                          v-model.number="performanceFiltering"
                          class="w-6 rounded"
                      >
                      <input 
                          type="number" 
                          v-model.number="performanceMaximum"
                          class="p-1 rounded"
                      >
                  </div>
                  <div class="space-y-2 flex space-x-2 items-baseline justify-between">
                      <label class="text-sm truncate" for="accessibilityFiltering">Accessibility filtering:</label>
                      <input 
                          type="checkbox" 
                          v-model.number="accessibilityFiltering"
                          class="w-6 rounded"
                      >
                      <input 
                          type="number" 
                          v-model.number="accessibilityMaximum"
                          class="p-1 rounded"
                      >
                  </div>
                  <div class="space-y-2 flex space-x-2 items-baseline justify-between">
                      <label class="text-sm truncate" for="accessibilityFiltering">Best Practices filtering:</label>
                      <input 
                          type="checkbox" 
                          v-model.number="bestPracticesFiltering"
                          class="w-6 rounded"
                      >
                      <input 
                          type="number" 
                          v-model.number="bestPracticesMaximum"
                          class="p-1 rounded"
                      >
                  </div>
              </div>
              <button 
                  @click.prevent="startScraper" 
                  class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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

