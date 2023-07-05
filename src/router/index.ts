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
      path: '/previewExcel',
      name: 'previewExcel',
      component: () => import('@/views/previewExcel/PreviewExcel.vue'),
    },
    {
      path: '/previewDocx',
      name: 'previewDocx',
      component: () => import('@/views/previewDocx/PreviewDocx.vue'),
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
        {
          path: '/share',
          name: 'share',
          component: () => import('@/views/shareList/ShareList.vue'),
        },
        {
          path: '/recycle',
          name: 'recycle',
          component: () => import('@/views/recycle/Recycle.vue'),
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
