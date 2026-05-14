import { createRouter, createWebHistory } from 'vue-router'
import DesignPage from '@/pages/DesignPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DesignPage,
    },
    // {
    //   path: '/success',
    //   name: 'success',
    //   component: () => import('@/views/SuccessPage.vue')
    // }
  ],
})

export default router
