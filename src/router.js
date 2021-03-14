import Vue from 'vue'
import VueRouter from 'vue-router'

//import Table from './pages/Table.vue'
//import About from './pages/About.vue'
Vue.use(VueRouter)

const routes = [
    { path: '/', name: 'Table', component: () => import('./pages/Table.vue') },
    { path: '/about', name: 'About', component: () => import('./pages/About.vue') }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router