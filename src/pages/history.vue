<template>
    <div class="p-4 max-w-md mx-auto mt-16 space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <History class="w-5 h-5 text-primary" />
                    <span>Lịch sử tra cứu</span>
                </h1>

                <div class="text-sm text-base-content/60">
                    {{ history.length }} mục
                </div>
            </div>

            <div class="flex gap-2">
                <button @click="refreshHistory" :disabled="loading" class="btn btn-sm border border-gray-300 flex-1 gap-1">
                    <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
                    Làm mới
                </button>
                <button v-if="history.length" @click="clearHistory" class="btn btn-sm btn-error btn-outline gap-1">
                    <Trash2 class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
            <div class="flex flex-col items-center gap-3">
                <span class="loading loading-spinner loading-lg text-primary"></span>
                <p class="text-base-content/70">Đang tải lịch sử...</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-error">
            <span>Lỗi: {{ error }}</span>
        </div>

        <!-- Danh sách lịch sử -->
        <div v-else-if="history.length" class="space-y-3">
            <div v-for="(item, i) in history" :key="i"
                class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-200 hover:border-primary cursor-pointer active:scale-[0.98]"
                @click="openDetail(item)">
                <div class="card-body p-3">
                    <div class="flex items-center gap-3">
                        <div class="avatar placeholder shrink-0" :class="item.vehicleType === 'oto'
                            ? 'bg-linear-to-br from-blue-500 to-blue-300'
                            : 'bg-linear-to-br from-green-500 to-green-300'">
                            <div class="w-10 rounded-full flex items-center justify-center text-white">
                                <component :is="item.vehicleType === 'oto' ? Car : Bike" class="w-5 h-5" />
                            </div>
                        </div>

                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-base text-base-content truncate">{{ item.plate }}</h3>
                            <p class="text-sm text-base-content/70 capitalize">
                                {{ item.vehicleType === 'oto' ? 'Xe ô tô' : 'Xe máy' }}
                            </p>
                            <p class="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
                                <Clock class="w-3 h-3 shrink-0" />
                                <span class="truncate">{{ item.time }}</span>
                            </p>
                        </div>

                        <div class="text-primary flex items-center gap-1 text-sm font-medium shrink-0">
                            <Eye class="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Không có lịch sử -->
        <div v-else-if="!loading && !error" class="text-center text-base-content/60 mt-20 space-y-4">
            <div class="flex justify-center">
                <div class="p-4 rounded-full bg-base-200">
                    <History class="w-12 h-12 text-base-content/40" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-lg font-medium">Chưa có lịch sử tra cứu</p>
                <p class="text-sm opacity-70">Hãy thử tra cứu một biển số để lưu lại nhé 🚗</p>
            </div>
        </div>

        <!-- Popup chi tiết -->
        <dialog ref="detailModal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box relative max-w-md mx-auto p-4">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10" @click="closeDetail">
                    ✕
                </button>

                <div v-if="selected" class="space-y-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="avatar placeholder shrink-0" :class="selected.vehicleType === 'oto'
                            ? 'bg-linear-to-br from-blue-500 to-blue-300'
                            : 'bg-linear-to-br from-green-500 to-green-300'">
                            <div class="w-12 rounded-full flex items-center justify-center text-white">
                                <component :is="selected.vehicleType === 'oto' ? Car : Bike" class="w-6 h-6" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h2 class="font-bold text-lg text-base-content truncate">{{ selected.plate }}</h2>
                            <p class="text-sm text-base-content/70 capitalize">
                                {{ selected.vehicleType === 'oto' ? 'Xe ô tô' : 'Xe máy' }}
                            </p>
                        </div>
                    </div>

                    <div class="divider my-2"></div>

                    <div v-if="selected.apiResponse && selected.apiResponse.data && selected.apiResponse.data.length"
                        class="space-y-3">
                        <div v-for="(violation, index) in selected.apiResponse.data" :key="index"
                            class="card border shadow-sm transition-all duration-300 rounded-lg p-3"
                            :class="violation['Trạng thái'].includes('Chưa') ? 'bg-error/10 border-error/20 text-error-content' : 'bg-success/10 border-success/20 text-success-content'">
                            <div class="flex flex-col gap-2 mb-3">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-semibold text-sm text-base-content">Vi phạm {{ index + 1 }}</h3>
                                    <span :class="[
                                        'badge text-xs font-semibold border-none px-2 py-1 rounded-md',
                                        violation['Trạng thái'].includes('Chưa')
                                            ? 'bg-error text-error-content'
                                            : 'bg-success text-success-content'
                                    ]">
                                        {{ violation['Trạng thái'] }}
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-2 text-sm leading-relaxed text-base-content">
                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Màu
                                        biển</span>
                                    <span class="text-sm text-base-content">{{ violation['Màu biển'] }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Thời
                                        gian vi phạm</span>
                                    <span class="text-sm text-base-content">{{ violation['Thời gian vi phạm'] }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Địa
                                        điểm</span>
                                    <span class="text-sm wrap-break-word text-base-content">{{ violation['Địa điểm vi phạm'] }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Hành
                                        vi</span>
                                    <span class="text-sm wrap-break-word text-base-content">{{ violation['Hành vi vi phạm'] }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Đơn
                                        vị phát hiện</span>
                                    <span class="text-sm wrap-break-word text-base-content">{{ violation['Đơn vị phát hiện vi phạm']
                                        }}</span>
                                </div>
                            </div>

                            <div class="mt-3 pt-3 border-t border-base-content/10">
                                <div class="flex flex-col gap-1">
                                    <span class="font-medium text-xs text-base-content/70 uppercase tracking-wide">Nơi
                                        giải quyết</span>
                                    <div class="space-y-1 mt-1">
                                        <div v-for="(place, j) in violation['Nơi giải quyết vụ việc']" :key="j"
                                            class="text-sm wrap-break-word pl-2 border-l-2 border-primary/50 text-base-content">
                                            {{ place }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-xs text-center mt-4 p-3 bg-base-200 rounded-lg text-base-content">
                            <div class="grid grid-cols-2 gap-2 mb-2">
                                <div class="text-base-content/80">Tổng: <span class="font-semibold text-base-content">{{ selected.apiResponse.data_info?.total || 0
                                        }}</span></div>
                                <div class="text-base-content/80">Chưa xử: <span class="font-semibold text-error">{{
                                    selected.apiResponse.data_info?.chuaxuphat || 0 }}</span></div>
                            </div>
                            <div class="text-xs text-base-content/60">
                                Cập nhật: {{ selected.apiResponse.data_info?.latest || 'N/A' }}
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-success p-4 bg-success/10 rounded">
                        🎉 Không có vi phạm nào!
                    </div>
                </div>

                <div class="modal-action mt-4">
                    <button class="btn btn-primary w-full" @click="closeDetail">Đóng</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
    Car,
    Bike,
    Trash2,
    Clock,
    History,
    Eye,
    RefreshCw,
} from 'lucide-vue-next'
import { useHistoryStore } from '../store/history'
import { useHead } from '@vueuse/head'

useHead({
    title: 'Lịch sử tra cứu | Phạt nguội',
    meta: [
        { name: 'description', content: 'Xem lịch sử tra cứu của bạn' },
    ],
})

const selected = ref<any | null>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const historyStore = useHistoryStore()

const history = computed(() => historyStore.history)
const loading = computed(() => historyStore.isLoading)
const error = computed(() => historyStore.error)

onMounted(async () => {
    await historyStore.loadHistory()
})

async function clearHistory() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
        await historyStore.clearHistory()
        selected.value = null
    }
}

async function refreshHistory() {
    await historyStore.refreshHistory()
}

function openDetail(item: any) {
    selected.value = item
    detailModal.value?.showModal()
}

function closeDetail() {
    detailModal.value?.close()
    selected.value = null
}
</script>
