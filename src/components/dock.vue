<template>
    <div class="dock bg-base-200 flex justify-around">
        <RouterLink to="/" class="flex flex-col items-center text-base-content/70 hover:text-base-content transition"
            :class="{ 'text-primary font-semibold': route.path === '/' }">
            <House />
            <span class="text-xs mt-1">Trang chủ</span>
        </RouterLink>
        <RouterLink to="/about"
            class="flex flex-col items-center text-base-content/70 hover:text-base-content transition"
            :class="{ 'text-primary font-semibold': route.path.startsWith('/about') }">
            <History />
            <span class="text-xs mt-1">Lịch sử</span>
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { House, History } from 'lucide-vue-next'

const route = useRoute()
</script>
