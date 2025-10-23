import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFetch } from '../composable/useFetch'

export interface HistoryItem {
    id: string
    plate: string
    vehicleType: 'oto' | 'xemay'
    time: string
    apiResponse: any
    searchTime: string
    createdAt: string
}

export const useHistoryStore = defineStore('history', () => {
    const history = ref<HistoryItem[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const lastFetch = ref<Date | null>(null)
    
    const { readRecords, deleteRecord, createRecord } = useFetch()
    
    const CACHE_DURATION = 10 * 60 * 1000
    
    const isCacheValid = computed(() => {
        if (!lastFetch.value) return false
        return Date.now() - lastFetch.value.getTime() < CACHE_DURATION
    })
    
    const loadHistory = async (forceRefresh = false) => {
        if (isCacheValid.value && !forceRefresh && history.value.length > 0) {
            return history.value
        }
        
        isLoading.value = true
        error.value = null
        
        try {
            const data = await readRecords('search_history', {})
            if (data) {
                history.value = data.map((item: any) => ({
                    id: item.id,
                    plate: item.plate,
                    vehicleType: item.vehicle_type,
                    time: new Date(item.search_time).toLocaleString('vi-VN'),
                    apiResponse: item.api_response,
                    searchTime: item.search_time,
                    createdAt: item.created_at
                })).sort((a: HistoryItem, b: HistoryItem) => 
                    new Date(b.searchTime).getTime() - new Date(a.searchTime).getTime()
                )
                
                lastFetch.value = new Date()
            }
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi tải lịch sử'
            console.error('Lỗi khi tải lịch sử:', err)
        } finally {
            isLoading.value = false
        }
        
        return history.value
    }
    
    const addHistoryItem = async (plate: string, vehicleType: 'oto' | 'xemay', apiResponse: any) => {
        try {
            const searchRecord = {
                plate,
                vehicle_type: vehicleType,
                search_time: new Date().toISOString(),
                api_response: apiResponse,
                created_at: new Date().toISOString()
            }
            
            const result = await createRecord('search_history', searchRecord)
            
            if (result && result[0]) {
                const newItem: HistoryItem = {
                    id: result[0].id,
                    plate,
                    vehicleType,
                    time: new Date().toLocaleString('vi-VN'),
                    apiResponse,
                    searchTime: searchRecord.search_time,
                    createdAt: searchRecord.created_at
                }
                
                history.value.unshift(newItem)
                history.value.sort((a: HistoryItem, b: HistoryItem) => 
                    new Date(b.searchTime).getTime() - new Date(a.searchTime).getTime()
                )
                
                if (history.value.length > 50) {
                    history.value = history.value.slice(0, 50)
                }
            }
        } catch (err: any) {
            console.error('Lỗi khi thêm lịch sử:', err)
        }
    }
    
    const clearHistory = async () => {
        try {
            for (const item of history.value) {
                await deleteRecord('search_history', item.id)
            }
            
            history.value = []
            lastFetch.value = null
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi xóa lịch sử'
            console.error('Lỗi khi xóa lịch sử:', err)
        }
    }
    
    const removeHistoryItem = async (id: string) => {
        try {
            await deleteRecord('search_history', id)
            history.value = history.value.filter(item => item.id !== id)
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi xóa mục lịch sử'
            console.error('Lỗi khi xóa mục lịch sử:', err)
        }
    }
    
    const refreshHistory = () => {
        return loadHistory(true)
    }
    
    return {
        history: computed(() => history.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        isCacheValid: computed(() => isCacheValid.value),
        
        loadHistory,
        addHistoryItem,
        clearHistory,
        removeHistoryItem,
        refreshHistory
    }
})
