import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      component: HomeView,
      alias: ['/home']
    },
    {
      path: '/auth',
      children: [
        {
          path: '',
          name: 'signup',
          component: () => import('../views/SignupView.vue')
        },
        {
          path: 'login',
          name: 'login',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/LoginView.vue')
        },
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: 'ErrorPage',
      component: HomeView
      //We should replace HomeView later with a dedicated page 404 route not found error.
    }
  ]
})

export default router
