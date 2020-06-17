import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login'
import chat from '../pages/chat'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'chat',
      component: chat,
      beforeEnter: function (to, from, next) {
        var auth = window.firebase.auth();
        if (auth.currentUser) {
          next()
        }
        else {
          next('/login')
        }
      }
    }
  ]
})
