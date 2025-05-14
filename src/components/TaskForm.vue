<template>
  <form @submit.prevent="submit" class="mb-4 space-y-2">
    <input v-model="title" placeholder="Task title" class="w-full p-2 border rounded" />
    <select v-model="priority" class="w-full p-2 border rounded">
      <option disabled value="">Select Priority</option>
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>
    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Add Task</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'

const emit = defineEmits(['task-added'])

const title = ref('')
const priority = ref('')

const store = useTaskStore()

const submit = async () => {
  if (!title.value || !priority.value) return alert('Please fill all fields')
  await store.addTask({ title: title.value, priority: priority.value })
  title.value = ''
  priority.value = ''
  emit('task-added')
}
</script>
