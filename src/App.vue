<template>
  <div class="hidden md:flex items-center justify-center min-h-screen bg-base-100">
    <div class="text-center space-y-4 p-8">
      <div class="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-base-content">Phạt Nguội</h1>
      <p class="text-base-content/70 text-lg max-w-md">
        Ứng dụng này được tối ưu hóa cho thiết bị di động
      </p>
      <p class="text-sm text-base-content/50">
        Vui lòng sử dụng trên điện thoại để có trải nghiệm tốt nhất
      </p>
      <div class="mt-6 p-4 bg-base-200 rounded-lg">
        <p class="text-sm text-base-content/60">
          Mở trên điện thoại để sử dụng đầy đủ tính năng
        </p>
      </div>
    </div>
  </div>

  <div class="md:hidden">
    <SplashScreen v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import SplashScreen from './components/SplashScreen.vue'

const isLoading = ref(true)
let themeObserver: MutationObserver | null = null

function applyMetaForTheme(theme: string | null) {
  const metaThemeColor = document.querySelector<HTMLMetaElement>('#meta-theme-color')
  const metaStatusBar = document.querySelector<HTMLMetaElement>('#meta-status-bar')

  if (theme === 'dark') {
    metaThemeColor?.setAttribute('content', '#1D232A')
    metaStatusBar?.setAttribute('content', 'black')
  } else {
    metaThemeColor?.setAttribute('content', '#ffffff')
    metaStatusBar?.setAttribute('content', 'white')
  }
}

onMounted(() => {
  applyMetaForTheme(document.documentElement.getAttribute('data-theme'))

  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const currentTheme = document.documentElement.getAttribute('data-theme')
        applyMetaForTheme(currentTheme)
      }
    }
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})
</script>
