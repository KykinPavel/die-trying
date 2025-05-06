<template>
  <div class="bg-slate-900 h-screen text-white">
    <NuxtLayout>
      <HeaderComponent />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import HeaderComponent from "~/components/PageHeader/index.vue";
</script>
