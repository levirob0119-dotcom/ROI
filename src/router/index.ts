import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Try from '../components/Try.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      text: '首页',
    },
  },
  {
    path: '/try',
    name: 'Try',
    component: Try,
  },
];

const router = createRouter({
  history: createWebHistory('#'),
  routes,
});

export default router;
