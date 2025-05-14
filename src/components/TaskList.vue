<template>
  <draggable
    v-model="localTasks"
    item-key="id"
    @end="emitReorder"
    class="space-y-2"
  >
    <template #item="{ element: task }">
      <TaskItem :task="task" @updated="emitUpdate" @deleted="emitDelete" />
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import draggable from 'vuedraggable'

const props = defineProps(['tasks'])
const emit = defineEmits(['task-updated', 'task-deleted', 'reorder'])

const localTasks = ref([...props.tasks])

watch(() => props.tasks, (val) => {
  localTasks.value = [...val]
})

const emitReorder = () => {
  emit('reorder', localTasks.value.map(t => t.id))
}

const emitUpdate = () => emit('task-updated')
const emitDelete = () => emit('task-deleted')
</script>
