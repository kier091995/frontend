import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getUser = async () => {
    try {
      const res = await api.get('/api/user')
      user.value = res.data
    } catch (err) {
      user.value = null
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      await api.get('/sanctum/csrf-cookie') // Required by Sanctum
      await api.post('/login', credentials)

      await getUser()
      router.push('/')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
      user.value = null
      router.push('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return {
    user,
    loading,
    error,
    getUser,
    login,
    logout,
  }
})
