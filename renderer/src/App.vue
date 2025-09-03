<template>
  <NavBar />
  <div class="flex min-h-[100vh]"> <!-- Adjust the space.12 based on your navbar height -->
    <Tweaker class="w-96" />
    <RouterView class="flex-1 flex w-full" />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue"
import Tweaker from "./components/Tweaker.vue";
import { RouterView } from "vue-router"
</script>