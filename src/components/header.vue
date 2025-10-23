<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 navbar bg-base-100 border-b border-base-300 px-4 md:hidden flex justify-between items-center">
        <!-- Logo -->
        <a class="btn btn-ghost text-xl font-bold">MyApp</a>

        <!-- Nút Dark Mode -->
        <button class="btn btn-ghost btn-circle" @click="toggleDarkMode" aria-label="Toggle dark mode">
            <Sun v-if="!isDark" class="w-6 h-6" />
            <Moon v-else class="w-6 h-6" />
        </button>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

const isDark = ref(false)

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme === 'dark'
    updateHtmlClass()
})

function toggleDarkMode() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    updateHtmlClass()
}

function updateHtmlClass() {
    const html = document.documentElement
    if (isDark.value) {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
    } else {
        html.classList.remove('dark')
        html.setAttribute('data-theme', 'light')
    }
}
</script>

<style scoped>
/* Nếu muốn header có bóng nhẹ */
header {
    backdrop-filter: blur(8px);
    background-color: rgb(var(--b1) / 0.9);
    /* daisyUI bg-base-100 với độ mờ */
}
</style>
