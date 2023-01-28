/*
 * @Author: hjm
 * @Date: 2022-09-01 09:47:24
 * @LastEditors: hjm
 * @LastEditTime: 2022-09-19 10:57:44
 * @Description: file content
 */
import Router from 'vue-router'
import Vue from 'vue';
// router.js中,将Vue.use使用判断条件,生产环境不要使用Vue.use(Router)
if (process.env.NODE_ENV === 'development') {
  (window.OUTVUE || Vue).use(Router)
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/test'),
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('@/views/article'),
    },
    {
      path: '/design',
      name: 'design',
      component: () => import('@/views/design'),
    },
    {
      path: '/crud',
      name: 'crud',
      component: () => import('@/views/crud'),
    },
    {
      path: '/crud2',
      name: 'crud2',
      component: () => import('@/views/crud2'),
    },
    {
      path: '/table',
      name: 'Table',
      component: () => import('@/views/table'),
    },
    {
      path: '/form',
      name: 'design',
      component: () => import('@/views/form'),
    },
    {
      path: '/formManage',
      name: 'formManage',
      component: () => import('@/views/formManage'),
    },
    {
      path: '/formEdit',
      name: 'formEdit',
      component: () => import('@/views/formEdit'),
    },
    {
      path: '/testTyPcForm/:id',
      name: 'testTyPcForm',
      component: () => import('@/views/testTyPcForm'),
    },
    {
      path: '/interactionForm',
      name: 'interactionForm',
      component: () => import('@/views/interactionForm'),
    },
    // {
    //   path: '/crud1',
    //   name: 'crud1',
    //   component: () => import('@/views/crud1'),
    // },
  ]
})


//解决Vue-router在3.1之后把$router.push()方法改为了Promise后导致的报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location,onResolve,onReject) {
  if (onResolve || onReject) return originalPush.call(this,location,onResolve,onReject)
  return originalPush.call(this,location).catch(err => err)
}
//解决Vue-router在3.1之后把$router.push()方法改为了Promise后导致的报错问题

export default router