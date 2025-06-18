import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import QrGenerator from '../views/QrGenerator.vue'
import Medicion from '../views/Medicion.vue'
import Reporte from '../views/Reporte.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/qrgenerator', component: QrGenerator },
    { path: '/medicion', component: Medicion },
    { path: '/reporte', component: Reporte },


  ],
})

export default router
