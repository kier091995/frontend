// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import TaskView from '@/views/TaskView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import CreateTaskView from '@/views/CreateTaskView.vue'; // Import the new CreateTaskView

import { useAuthStore } from '@/stores/auth';

// Define your routes
const routes = [
  {
    path: '/',
    name: 'Tasks',
    component: TaskView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/create-task',
    name: 'CreateTask',
    component: CreateTaskView, // Add Create Task route
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !auth.user) {
    await auth.getUser();
    if (!auth.user) return next('/login');
  }

  // Check if the route requires admin role
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    return next('/');
  }

  next();
});

export default router;
