import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CPanelView from '../views/CPanelView.vue'
import UsuariosView from '../views/config/UsuariosView.vue'
import RolesView from '../views/config/RolesView.vue'
import MedidoresView from '../views/config/MedidoresView.vue'
import AreasView from '../views/config/AreasView.vue'
import QrGeneradosView from '../views/config/QrGeneradosView.vue'
import ConfigIndexView from '../views/config/ConfigIndexView.vue'

const routes = [
  {
    path: '/',
    component: LoginView,
    meta: { layout: 'auth' }
  },
  {
    path: '/login',
    component: LoginView,
    meta: { layout: 'auth' }
  },
  {
    path: '/dashboard',
    component: CPanelView,
    meta: { layout: 'default' }
  },
  {
    path: '/config/usuarios',
    component: UsuariosView
  },
  {
    path: '/config/roles',
    component: RolesView
  },
  {
    path: '/config/medidores',
    component: MedidoresView
  },
  {
    path: '/config/areas',
    component: AreasView
  },
  {
    path: '/config/qr',
    component: QrGeneradosView
  },
    {
    path: '/config',
    component: ConfigIndexView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
