import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/Layout.vue'
import { localGet } from '@/utils/util'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/home/Home.vue'),
        },
      ],
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
