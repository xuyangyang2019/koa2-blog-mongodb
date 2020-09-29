import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
const fetchBar = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(111111)
            resolve('bar 组件返回 ajax 数据')
        }, 1000)
    })
}

function createStore() {
    const store = new Vuex.Store({
        state: {
            bar: ''
        },
        actions: {
            fetchBar({ commit }) {
                return fetchBar().then((data) => {
                    commit('SET_BAR', data)
                }).catch((err) => {
                    console.error(err)
                })
            }
        },
        mutations: {
            'SET_BAR'(state, data) {
                state.bar = data
            }
        }
    })

    if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__)
        store.replaceState(window.__INITIAL_STATE__)
    } else {
        console.log('no browser')
    }

    return store
}

export default createStore