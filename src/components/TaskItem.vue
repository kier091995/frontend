<template>
  <transition name="fade">
    <div
      :class="[
        'p-3 rounded shadow flex justify-between items-center',
        task.completed ? 'bg-gray-200' : getPriorityColor(task.priority),
      ]"
    >
      <div>
        <h3 :class="{ 'line-through': task.completed }">{{ task.title }}</h3>
        <p class="text-sm text-gray-500">Priority: {{ task.priority }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="toggleComplete" class="text-green-600 hover:underline">✓</button>
        <button v-if="isAdmin" @click="removeTask" class="text-red-600 hover:underline">✕</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'

const props = defineProps(['task'])
const emit = defineEmits(['updated', 'deleted'])

const store = useTaskStore()
const auth = useAuthStore()

const isAdmin = auth.user?.role === 'admin'

const toggleComplete = async () => {
  await store.updateTask(props.task.id, { completed: !props.task.completed })
  emit('updated')
}

const removeTask = async () => {
  await store.deleteTask(props.task.id)
  emit('deleted')
}

const getPriorityColor = (priority) => {
  return {
    Low: 'bg-blue-100',
    Medium: 'bg-yellow-100',
    High: 'bg-red-100',
  }[priority] || 'bg-white'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
