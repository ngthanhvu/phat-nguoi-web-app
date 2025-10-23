<template>
    <div class="flex flex-col">
        <Header />
        <main class="p-4">
            <router-view />
        </main>
        <Dock />
    </div>
</template>

<script setup lang="ts">
import Dock from '../components/dock.vue';
import Header from '../components/header.vue';
</script>

<style scoped></style>