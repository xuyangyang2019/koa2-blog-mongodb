import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

// import { createStore } from './store'
// import { sync } from 'vuex-router-sync'
// import titleMixin from './util/title'
// import * as filters from './util/filters'
// import axios from 'axios'
// import conf from '../../config/app'

// Vue.prototype.$request = axios.create({
//   baseURL: 'http://' + conf.app.devHost + ':' + conf.app.port,
//   timeout: 1000
// })
// Vue.prototype.$isProd = process.env.NODE_ENV === 'production'

// Vue.mixin(titleMixin)

// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

export function createApp(context) {
    // const store = createStore()
    const router = createRouter()
    // sync the router with the vuex store.
    // this registers `store.state.route`
    // sync(store, router)

    const app = new Vue({
        router,
        context,
        render: h => h(App)
    })

    return { app, router }
}
