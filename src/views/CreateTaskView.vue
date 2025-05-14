<!-- src/views/CreateTaskView.vue -->
<template>
  <div class="create-task">
    <h2>Create a New Task</h2>
    <form @submit.prevent="createTask">
      <input
        type="text"
        v-model="title"
        placeholder="Task Title"
        required
      />
      <textarea
        v-model="description"
        placeholder="Task Description"
        required
      ></textarea>
      <select v-model="priority" required>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore';

const title = ref('');
const description = ref('');
const priority = ref('low');

const taskStore = useTaskStore();

const createTask = async () => {
  if (title.value && description.value && priority.value) {
    await taskStore.createTask({
      title: title.value,
      description: description.value,
      priority: priority.value,
    });
    title.value = '';
    description.value = '';
    priority.value = 'low';
  }
};
</script>

<style scoped>
/* Add your styling here */
.create-task {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
}

input,
textarea,
select {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 1rem;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}
</style>
