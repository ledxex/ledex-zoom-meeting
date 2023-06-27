/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [

    {
      path: '/',
      name: 'Home',
      component: () => import('./components/Home.vue'),
      meta: {
      }
    }, 

    {
      path: '/thanks',
      name: 'Thanks',
      component: () => import('./components/Thanks.vue'),
      meta: {
      }
    }, 

    {
      path: '/room',
      name: 'Room',
      props: true,
      component: () => import('./components/Room.vue'),
      meta: {
      }
    }, 

    {
      path: '*',
      redirect: '/pages/error-404'
    }

  ]
})

// router.afterEach(() => {
//   // Remove initial loading
//   const appLoading = document.getElementById('loading-bg')
//   if (appLoading) {
//     appLoading.style.display = 'none'
//   }
// })

// router.beforeEach((to, from, next) => {
//   if (
//     to.path === '/login' ||
//     to.path === '/pages/forgot-password' ||
//     to.path === '/pages/error-404' ||
//     to.path === '/pages/error-500' ||
//     to.path === '/pages/register' ||
//     to.path === '/callback' ||
//     localStorage.getItem('idToken') || 1
//   ) {
//     return next()
//   }
// })


export default router
