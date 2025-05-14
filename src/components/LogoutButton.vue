<template>
  <button
    @click="auth.logout"
    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Logout
  </button>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>