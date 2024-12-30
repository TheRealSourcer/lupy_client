
<template>
    <div class="w-full h-full">
      <div id="react-graphs" class="w-full h-full"></div>
    </div>
</template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { createRoot } from 'react-dom/client';
  import Charts from "../components/Charts.jsx"
  
  onMounted(() => {
    const container = document.getElementById('react-graphs');
    const root = createRoot(container);
    root.render(Charts());
  });
</script>