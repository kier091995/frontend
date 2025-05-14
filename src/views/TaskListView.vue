<template>
  <!-- Filters (previous section) -->
  <div class="flex flex-wrap gap-4 mb-4">
    <select v-model="statusFilter" class="px-3 py-2 rounded border">
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>

    <select v-model="priorityFilter" class="px-3 py-2 rounded border">
      <option value="all">All Priorities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search tasks..."
      class="flex-1 px-4 py-2 border rounded"
    />
  </div>

  <!-- Drag and Drop Task List -->
  <draggable
    v-model="tasks"
    :group="'tasks'"
    @end="onDragEnd"
    item-key="id"
    class="space-y-4"
  >
    <template #item="{ element: task }">
      <li
        :class="{
          'bg-gray-100': task.completed,
          'bg-white': !task.completed,
        }"
        class="flex justify-between items-center p-4 rounded-md shadow-md border"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="task.completed"
            @change="updateTaskStatus(task)"
            class="mr-4"
          />
          <span class="flex-1">{{ task.title }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <span :class="task.priority">
            {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
          </span>
          <button
            v-if="isAdmin"
            @click="deleteTask(task)"
            class="bg-red-500 text-white p-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </li>
    </template>
  </draggable>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import draggable from 'vuedraggable'

const onDragEnd = async () => {
  try {
    // Send the reordered tasks to the backend
    await api.updateTaskOrder(tasks.value.map(task => task.id))
  } catch (error) {
    console.error('Failed to update task order:', error)
  }
}

const statusFilter = ref('all')
const priorityFilter = ref('all')
const searchTerm = ref('')

const auth = useAuthStore()

const tasks = ref([])
const newTask = ref('')
const newPriority = ref('')


const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'pending' && !task.completed) ||
      (statusFilter.value === 'completed' && task.completed)

    const matchesPriority =
      priorityFilter.value === 'all' || task.priority === priorityFilter.value

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.value.toLowerCase())

    return matchesStatus && matchesPriority && matchesSearch
  })
})

const fetchTasks = async () => {
  try {
    const res = await api.get('/api/tasks')
    tasks.value = res.data.data // assuming you're using API resources
  } catch (err) {
    console.error('Error fetching tasks', err)
  }
}

const createTask = async () => {
  try {
    const res = await api.post('/api/tasks', {
      title: newTask.value,
      priority: newPriority.value,
    })
    tasks.value.push(res.data.data)
    newTask.value = ''
    newPriority.value = ''
  } catch (err) {
    console.error('Create failed', err)
  }
}

const completeTask = async (id) => {
  try {
    await api.put(`/api/tasks/${id}`, { completed: true })
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.completed = true
  } catch (err) {
    console.error('Complete failed', err)
  }
}

const deleteTask = async (id) => {
  try {
    await api.delete(`/api/tasks/${id}`)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  } catch (err) {
    console.error('Delete failed', err)
  }
}

const priorityColor = (priority) => {
  return {
    'border-green-400': priority === 'low',
    'border-yellow-400': priority === 'medium',
    'border-red-500': priority === 'high',
  }
}

onMounted(() => {
  fetchTasks()
})
</script>
