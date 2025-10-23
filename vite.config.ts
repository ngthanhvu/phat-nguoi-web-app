import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [vue(), tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['logo.png',],
    manifest: {
      name: 'Check Phạt Nguội',
      short_name: 'Phạt Nguội',
      description: 'Ứng dụng kiểm tra phạt nguội phương tiện',
      theme_color: '#42b883',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  }),
  ],
})
