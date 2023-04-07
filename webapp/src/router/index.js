import vue from 'vue'
import router from 'vue-router'
import login from '../pages/login'
import principal from '../pages/principal'

vue.use(router)

export default new router({
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
            component: principal,
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
