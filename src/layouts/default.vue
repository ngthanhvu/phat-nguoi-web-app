<template>
    <div class="flex flex-col min-h-screen relative bg-base-200">
        <Header />

        <main class="flex-1 overflow-y-auto p-4 pb-16">
            <router-view />
        </main>

        <Dock />
    </div>
</template>

<script setup lang="ts">
import Dock from '../components/dock.vue'
import Header from '../components/header.vue'
</script>
