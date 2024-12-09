import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/task/edit/:id',
      name: 'edit',
      component: () => import('../views/EditView.vue'),
      props: true
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/Employees.vue')
    },
    {
      path: '/employee/view/:id',
      name: 'employee',
      component: () => import('../views/ViewEmployee.vue'),
      props: true
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

export default router
