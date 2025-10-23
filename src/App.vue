<template>
  <div class="hidden md:block text-center mt-10 text-lg">
    <p>
      Ứng dụng này chỉ dành cho giao diện mobile
    </p>
  </div>

  <div class="md:hidden">
    <SplashScreen v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SplashScreen from './components/SplashScreen.vue'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>
