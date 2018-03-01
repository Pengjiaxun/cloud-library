import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Books from '@/views/books'
import Users from '@/views/users'
import Records from '@/views/records'
import Wishes from '@/views/wishes'

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
            path: '/records',
            name: 'Records',
            component: Records
        },
        {
            path: '/wishes',
            name: 'Wishes',
            component: Wishes
        }
    ]
})
