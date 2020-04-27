import Vue from 'vue'
import Router from 'vue-router'
import todoMVC from '@/components/todoMVC'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'todoMVC',
      component: todoMVC
    },
    {
      path: '/active',
      name: 'todoMVC',
      component: todoMVC
    },
    {
      path: '/completed',
      name: 'todoMVC',
      component: todoMVC
    }
  ]
})
