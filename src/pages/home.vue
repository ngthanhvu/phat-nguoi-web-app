<template>
    <div class="p-4 mt-16 md:hidden max-w-md mx-auto space-y-4">
        <div class="form-control">
            <label class="label">
                <span class="label-text text-base font-semibold">Nhập biển số xe</span>
            </label>
            <input v-model="plate" type="text" placeholder="VD: 30F-882.51" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
            <label class="label">
                <span class="label-text text-base font-semibold">Loại phương tiện</span>
            </label>

            <div class="grid grid-cols-2 gap-3 mt-1">
                <div class="card border transition-all cursor-pointer hover:shadow-md rounded-xl"
                    :class="vehicleType === 'oto' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-gray-200'"
                    @click="vehicleType = 'oto'">
                    <div class="card-body p-4 items-center text-center space-y-2">
                        <Car class="w-8 h-8 text-primary" />
                        <h3 class="font-semibold">Xe ô tô</h3>
                    </div>
                </div>

                <div class="card border transition-all cursor-pointer hover:shadow-md rounded-xl"
                    :class="vehicleType === 'xemay' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-gray-200'"
                    @click="vehicleType = 'xemay'">
                    <div class="card-body p-4 items-center text-center space-y-2">
                        <Bike class="w-8 h-8 text-primary" />
                        <h3 class="font-semibold">Xe máy</h3>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-primary w-full mt-2" :disabled="loading || !plate || !vehicleType" @click="fetchData">
            <span v-if="!loading">Tra cứu</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
        </button>

        <div v-if="result && result.status === 1 && result.data?.length" class="mt-5 space-y-3">
            <transition-group name="fade" tag="div">
                <div v-for="(item, i) in result.data" :key="i" :class="[
                    'card border shadow-sm transition-all duration-300 rounded-xl mt-3',
                    statusColor(item['Trạng thái'])
                ]">
                    <div class="card-body p-3">
                        <div class="flex justify-between items-center mb-2">
                            <div class="flex items-center gap-2">
                                <Car class="w-5 h-5" />
                                <h2 class="card-title text-base font-bold">
                                    {{ item['Biển kiểm soát'] }}
                                </h2>
                            </div>

                            <span :class="[
                                'badge text-xs font-semibold border-none px-2 py-1 rounded-md',
                                item['Trạng thái'].includes('Chưa')
                                    ? 'bg-red-500 text-white'
                                    : 'bg-green-500 text-white'
                            ]">
                                {{ item['Trạng thái'] }}
                            </span>
                        </div>

                        <ul class="space-y-1 text-sm leading-tight">
                            <li><b>Màu biển:</b> {{ item['Màu biển'] }}</li>
                            <li><b>Loại phương tiện:</b> {{ item['Loại phương tiện'] }}</li>
                            <li><b>Thời gian:</b> {{ item['Thời gian vi phạm'] }}</li>
                            <li><b>Địa điểm:</b> {{ item['Địa điểm vi phạm'] }}</li>
                            <li><b>Hành vi:</b> {{ item['Hành vi vi phạm'] }}</li>
                            <li><b>Đơn vị phát hiện:</b> {{ item['Đơn vị phát hiện vi phạm'] }}</li>
                        </ul>

                        <div class="mt-2 text-sm">
                            <b>Nơi giải quyết:</b>
                            <ul class="list-disc list-inside opacity-90 space-y-0.5 mt-1">
                                <li v-for="(n, j) in item['Nơi giải quyết vụ việc']" :key="j" class="leading-snug">
                                    {{ n }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </transition-group>

            <div class="text-sm opacity-70 text-center mt-4">
                Tổng: {{ result.data_info?.total || 0 }} vụ •
                Chưa xử phạt: {{ result.data_info?.chuaxuphat || 0 }} •
                Đã xử phạt: {{ result.data_info?.daxuphat || 0 }}
                <br />
                Cập nhật gần nhất: {{ result.data_info?.latest || 'N/A' }}
            </div>
        </div>

        <div v-else-if="result && result.status === 2"
            class="text-center text-success mt-4 card border shadow-sm transition-all duration-300 rounded-xl p-3">
            🎉 Xe của bạn không có vi phạm nào!
        </div>

        <div v-if="error" class="alert alert-error mt-4">
            <span>Lỗi: {{ error }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Car, Bike } from 'lucide-vue-next'
import { useHead } from '@unhead/vue'
import { useFetch } from '../composable/useFetch'
import { useHistoryStore } from '../store/history'

useHead({
    title: 'Trang chủ | Phạt nguội',
    meta: [
        { name: 'description', content: 'Trang chủ của ứng dụng Phạt nguội' }
    ]
})

const plate = ref('')
const vehicleType = ref('')
const { loading, error, result, fetchPhatNguoi } = useFetch()
const historyStore = useHistoryStore()

function statusColor(status: string) {
    if (status.includes('Chưa')) return 'bg-red-50 border-red-200 text-red-900'
    if (status.includes('Đã')) return 'bg-green-50 border-green-200 text-green-900'
    return 'bg-gray-50 border-gray-200 text-gray-800'
}
async function fetchData() {
    if (!plate.value || !vehicleType.value) return

    try {
        // Gọi API thực
        await fetchPhatNguoi(plate.value)
        
        // Lưu lịch sử vào store nếu có kết quả
        if (result.value && (result.value.status === 1 || result.value.status === 2)) {
            await historyStore.addHistoryItem(plate.value, vehicleType.value as 'oto' | 'xemay', result.value)
        }
    } catch (err) {
        console.error('Lỗi khi tra cứu:', err)
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.fade-enter-to {
    opacity: 1;
    transform: translateY(0);
}
</style>
