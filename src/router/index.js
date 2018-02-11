import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Books from '@/views/books'
import Users from '@/views/users'
import Logs from '@/views/logs'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'books'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/books',
            name: 'Books',
            component: Books
        },
        {
            path: '/users',
            name: 'Users',
            component: Users
        },
        {
            path: '/logs',
            name: 'Logs',
            component: Logs
        }
    ]
})
