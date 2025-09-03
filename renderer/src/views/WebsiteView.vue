<template>
    <webview 
      :src="url" 
      class="w-full min-h-full"
      allowpopups
    ></webview>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  // Define props
  defineProps({
    url: {
      type: String,
      required: true
    }
  });
</script>