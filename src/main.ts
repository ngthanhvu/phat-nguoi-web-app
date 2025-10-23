import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'

import './style.css'

const head = createHead()
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(head)
app.use(pinia)

app.mount('#app')

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('Có bản cập nhật mới, tải lại trang?')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('Ứng dụng sẵn sàng hoạt động offline!')
    },
})