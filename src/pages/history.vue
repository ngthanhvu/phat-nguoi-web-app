<template>
    <div class="p-4 max-w-md mx-auto mt-16 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold flex items-center gap-2">
                <History class="w-6 h-6 text-primary" />
                <span>Lịch sử tra cứu</span>
            </h1>

            <button v-if="history.length" @click="clearHistory" class="btn btn-sm btn-error btn-outline gap-1">
                <Trash2 class="w-4 h-4" /> Xóa hết
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="mt-2 text-gray-600">Đang tải lịch sử...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-error">
            <span>Lỗi: {{ error }}</span>
        </div>

        <!-- Danh sách lịch sử -->
        <div v-else-if="history.length" class="space-y-4">
            <div v-for="(item, i) in history" :key="i"
                class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary cursor-pointer"
                @click="openDetail(item)">
                <div class="card-body flex flex-row items-center justify-between p-4">
                    <div class="flex items-center gap-4">
                        <div class="avatar placeholder" :class="item.vehicleType === 'oto'
                            ? 'bg-linear-to-br from-blue-500 to-blue-300'
                            : 'bg-linear-to-br from-green-500 to-green-300'">
                            <div class="w-12 rounded-full flex items-center justify-center text-white">
                                <component :is="item.vehicleType === 'oto' ? Car : Bike" class="w-6 h-6" />
                            </div>
                        </div>

                        <div>
                            <h3 class="font-semibold text-base text-base-content">{{ item.plate }}</h3>
                            <p class="text-sm text-base-content/70 capitalize">
                                {{ item.vehicleType === 'oto' ? 'Xe ô tô' : 'Xe máy' }}
                            </p>
                            <p class="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
                                <Clock class="w-3.5 h-3.5" /> {{ item.time }}
                            </p>
                        </div>
                    </div>

                    <div class="text-primary flex items-center gap-1 text-sm font-medium">
                        <Eye class="w-4 h-4" /> Xem
                    </div>
                </div>
            </div>
        </div>

        <!-- Không có lịch sử -->
        <div v-else-if="!loading && !error" class="text-center text-base-content/60 mt-16 space-y-3 opacity-80">
            <div class="flex justify-center">
                <History class="w-12 h-12 text-base-content/40" />
            </div>
            <p>Chưa có lịch sử tra cứu nào.</p>
            <p class="text-sm opacity-60">Hãy thử tra cứu một biển số để lưu lại nhé 🚗</p>
        </div>

        <!-- Popup chi tiết -->
        <dialog ref="detailModal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box relative">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeDetail">
                    ✕
                </button>

                <div v-if="selected" class="space-y-3">
                    <div class="flex items-center gap-3 mb-2">
                        <component :is="selected.vehicleType === 'oto' ? Car : Bike" class="w-8 h-8 text-primary" />
                        <div>
                            <h2 class="font-bold text-lg text-base-content">{{ selected.plate }}</h2>
                            <p class="text-sm text-base-content/70 capitalize">
                                {{ selected.vehicleType === 'oto' ? 'Xe ô tô' : 'Xe máy' }}
                            </p>
                        </div>
                    </div>

                    <div class="divider my-2"></div>

                    <div v-if="selected.apiResponse && selected.apiResponse.data && selected.apiResponse.data.length" class="space-y-3">
                        <div v-for="(violation, index) in selected.apiResponse.data" :key="index" 
                             class="card border shadow-sm transition-all duration-300 rounded-xl p-3"
                             :class="violation['Trạng thái'].includes('Chưa') ? 'bg-error/10 border-error/20 text-error-content' : 'bg-success/10 border-success/20 text-success-content'">
                            <div class="flex justify-between items-center mb-2">
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
                            
                            <ul class="space-y-1 text-sm leading-tight text-base-content">
                                <li><b>Màu biển:</b> {{ violation['Màu biển'] }}</li>
                                <li><b>Thời gian vi phạm:</b> {{ violation['Thời gian vi phạm'] }}</li>
                                <li><b>Địa điểm:</b> {{ violation['Địa điểm vi phạm'] }}</li>
                                <li><b>Hành vi:</b> {{ violation['Hành vi vi phạm'] }}</li>
                                <li><b>Đơn vị phát hiện:</b> {{ violation['Đơn vị phát hiện vi phạm'] }}</li>
                            </ul>

                            <div class="mt-2 text-sm text-base-content">
                                <b>Nơi giải quyết:</b>
                                <ul class="list-disc list-inside opacity-90 space-y-0.5 mt-1">
                                    <li v-for="(place, j) in violation['Nơi giải quyết vụ việc']" :key="j" class="leading-snug">
                                        {{ place }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="text-sm opacity-70 text-center mt-4 p-2 bg-base-200 rounded text-base-content">
                            Tổng: {{ selected.apiResponse.data_info?.total || 0 }} vụ •
                            Chưa xử phạt: {{ selected.apiResponse.data_info?.chuaxuphat || 0 }} •
                            Đã xử phạt: {{ selected.apiResponse.data_info?.daxuphat || 0 }}
                            <br />
                            Cập nhật gần nhất: {{ selected.apiResponse.data_info?.latest || 'N/A' }}
                        </div>
                    </div>
                    
                    <div v-else class="text-center text-success p-4 bg-success/10 rounded">
                        🎉 Không có vi phạm nào!
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn btn-primary" @click="closeDetail">Đóng</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    Car,
    Bike,
    Trash2,
    Clock,
    History,
    Eye,
} from 'lucide-vue-next'
import { useFetch } from '../composable/useFetch'

const history = ref<any[]>([])
const selected = ref<any | null>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const { loading, error, readRecords, deleteRecord } = useFetch()

onMounted(async () => {
    await loadHistory()
})

async function loadHistory() {
    try {
        const data = await readRecords('search_history', {})
        if (data) {
            // Chuyển đổi dữ liệu từ Supabase sang format hiển thị
            history.value = data.map((item: any) => ({
                id: item.id,
                plate: item.plate,
                vehicleType: item.vehicle_type,
                time: new Date(item.search_time).toLocaleString('vi-VN'),
                apiResponse: item.api_response
            })).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
        }
    } catch (err) {
        console.error('Lỗi khi tải lịch sử:', err)
    }
}

async function clearHistory() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
        try {
            // Xóa từng record trong Supabase
            for (const item of history.value) {
                await deleteRecord('search_history', item.id)
            }
            history.value = []
            selected.value = null
        } catch (err) {
            console.error('Lỗi khi xóa lịch sử:', err)
        }
    }
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
