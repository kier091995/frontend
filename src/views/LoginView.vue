<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          :disabled="auth.loading"
        >
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="auth.error" class="text-red-600 mt-2 text-center">
          {{ auth.error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')

const auth = useAuthStore()

const handleLogin = () => {
  auth.login({
    email: email.value,
    password: password.value,
  })
}
</script>
