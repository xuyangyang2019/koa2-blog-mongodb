import Vue from 'vue'
import Router from 'vue-router'

import home from '../component/home.vue'
import item from '../component/item.vue'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/home',
                name: 'home',
                component: home
            },
            {
                path: '/item',
                name: 'item',
                component: item
            },
            {
                path: '/',
                redirect: '/home'
            }
        ]
    })
}
