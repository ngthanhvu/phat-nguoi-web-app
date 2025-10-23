import { ref } from 'vue'
import { supabase } from '../lib/supabase'

interface PhatNguoiResponse {
    status: number
    msg: string
    data: any[] | null
    data_info?: {
        total: number
        chuaxuphat: number
        daxuphat: number
        latest: string
    }
}

export function useFetch() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const result = ref<PhatNguoiResponse | null>(null)

    const fetchPhatNguoi = async (plate: string) => {
        loading.value = true
        error.value = null
        result.value = null

        try {
            const response = await fetch(import.meta.env.VITE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bienso: plate,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            result.value = data
        } catch (err: any) {
            error.value = err.message || 'Lỗi không xác định'
        } finally {
            loading.value = false
        }
    }
    const createRecord = async (table: string, payload: object) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supaError } = await supabase
                .from(table)
                .insert([payload])
                .select()

            if (supaError) throw supaError

            return data
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi tạo bản ghi'
            return null
        } finally {
            loading.value = false
        }
    }

    const readRecords = async (table: string, filters?: object) => {
        loading.value = true
        error.value = null

        try {
            let query = supabase.from(table).select('*')

            if (filters) {
                for (const key in filters) {
                    // ví dụ filter = { status: 'active' }
                    query = query.eq(key, (filters as any)[key])
                }
            }

            const { data, error: supaError } = await query

            if (supaError) throw supaError

            return data
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi đọc dữ liệu'
            return null
        } finally {
            loading.value = false
        }
    }

    const updateRecord = async (table: string, id: any, payload: object) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supaError } = await supabase
                .from(table)
                .update(payload)
                .eq('id', id)
                .select()

            if (supaError) throw supaError

            return data
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi cập nhật bản ghi'
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteRecord = async (table: string, id: any) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supaError } = await supabase
                .from(table)
                .delete()
                .eq('id', id)
                .select()

            if (supaError) throw supaError

            return data
        } catch (err: any) {
            error.value = err.message || 'Lỗi khi xóa bản ghi'
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        result,
        fetchPhatNguoi,
        createRecord,
        readRecords,
        updateRecord,
        deleteRecord,
    }
}
