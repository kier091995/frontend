// src/stores/taskStore.js
import { ref } from 'vue';
import { useSocket } from '@/services/socket';

const tasks = ref([]);
const socket = useSocket();

const fetchTasks = async () => {
  const response = await api.get('/tasks');
  tasks.value = response.data;
};

const updateTask = async (task) => {
  await api.put(`/tasks/${task.id}`, task);
  socket.emitTaskUpdated(task);
};

const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
  tasks.value = tasks.value.filter(task => task.id !== taskId);
};

const updateTaskOrder = (newOrder) => {
  newOrder.forEach((task, index) => {
    task.order = index;
  });
  socket.emitTaskUpdated(newOrder);
};

socket.onTaskUpdated((updatedTask) => {
  const index = tasks.value.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
});

// Named export for use in the component
export function useTaskStore() {
  return {
    tasks,
    fetchTasks,
    updateTask,
    deleteTask,
    updateTaskOrder,
  };
}
