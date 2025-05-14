<template>
  <div>
    <!-- Filters and Search Bar -->
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

    <!-- Task List -->
    <div class="task-list">
      <draggable v-model="tasks" :group="'tasks'" @end="onDragEnd">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
        >
          <div class="flex items-center justify-between p-2 border rounded mb-2">
            <span :class="`priority-${task.priority}`">{{ task.title }}</span>
            <div class="task-actions">
              <button v-if="auth.isAdmin" @click="deleteTask(task.id)">Delete</button>
              <button @click="toggleTaskCompletion(task.id)">
                {{ task.completed ? 'Mark as Pending' : 'Mark as Completed' }}
              </button>
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import draggable from 'vuedraggable';
import { useAuthStore } from '@/stores/auth';
import { useTaskStore } from '@/stores/taskStore';  // Now using named export
import { useSocket } from '@/services/socket';

const { connect, disconnect, onTaskUpdated } = useSocket();

// Get Auth and Task Stores
const auth = useAuthStore();
const taskStore = useTaskStore();

// Reactive state for filters and search term
const statusFilter = ref('all');
const priorityFilter = ref('all');
const searchTerm = ref('');

// Fetch tasks on component mount
onMounted(() => {
  taskStore.fetchTasks(); // Fetch tasks initially
  connect(); // Establish WebSocket connection

  onTaskUpdated((updatedTask) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  });
});

// WebSocket cleanup on component unmount
onUnmounted(() => {
  disconnect(); // Close WebSocket connection when component is unmounted
});

// Get the tasks from the store
const tasks = ref(taskStore.tasks);

// Function to handle drag end event
const onDragEnd = () => {
  taskStore.updateTaskOrder(tasks.value); // Send updated task order to store/backend
};

// Computed property for filtered tasks based on filters and search
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'pending' && !task.completed) ||
      (statusFilter.value === 'completed' && task.completed);

    const matchesPriority =
      priorityFilter.value === 'all' || task.priority === priorityFilter.value;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.value.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });
});

// Function to toggle task completion
const toggleTaskCompletion = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    taskStore.updateTask(task); // Update task in store
    socket.emitTaskUpdated(task); // Emit task update via WebSocket
  }
};

// Function to delete task (Admin only)
const deleteTask = (taskId) => {
  if (auth.isAdmin) {
    taskStore.deleteTask(taskId); // Delete task in store
    socket.emitTaskUpdated({ id: taskId, deleted: true }); // Emit delete event via WebSocket
  }
};
</script>
