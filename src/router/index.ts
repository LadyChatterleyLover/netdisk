import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { localGet } from '@/utils/util'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
    },
  ],
})

router.beforeEach((to, _, next) => {
  const whitePath = ['/login', '/register']
  const token = localGet('disk-token')
  if (whitePath.includes(to.path)) {
    next()
  } else {
    token ? next() : next('/login')
  }
})

export default router
