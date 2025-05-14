<template>
  <div class="flex flex-col sm:flex-row gap-2 mb-4">
    <select v-model="status" class="p-2 border rounded">
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
    <select v-model="priority" class="p-2 border rounded">
      <option value="all">All Priorities</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <input v-model="search" type="text" placeholder="Search" class="p-2 border rounded flex-1" />
  </div>
</template>

<script setup>
import { watchEffect, ref } from 'vue'
const emit = defineEmits(['filter-change'])

const status = ref('all')
const priority = ref('all')
const search = ref('')

watchEffect(() => {
  emit('filter-change', {
    status: status.value,
    priority: priority.value,
    search: search.value
  })
})
</script>
