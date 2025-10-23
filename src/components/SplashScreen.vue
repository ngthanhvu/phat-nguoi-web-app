<!-- components/SplashScreen.vue -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white z-100">
        <img src="/logo.png" alt="App Logo" class="w-32 h-32 animate-bounce mb-4" />
        <p class="text-gray-900 text-lg font-medium animate-pulse">
            Đang tải...
        </p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.animate-bounce {
    animation: bounce 2s infinite;
}

.animate-pulse {
    animation: pulse 1.5s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-15px);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
