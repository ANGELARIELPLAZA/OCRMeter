import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService';

import LoginView from '../views/LoginView.vue';
import CPanelView from '../views/CPanelView.vue';
import UsuariosView from '../views/config/UsuariosView.vue';
import RolesView from '../views/config/RolesView.vue';
import MedidoresView from '../views/config/MedidoresView.vue';
import AreasView from '../views/config/AreasView.vue';
import QrGeneradosView from '../views/config/QrGeneradosView.vue';
import ConfigIndexView from '../views/config/ConfigIndexView.vue';
import API from '@/views/information/ApiView.vue';

const routes = [
  { path: '/', component: LoginView, meta: { layout: 'auth' } },
  { path: '/login', component: LoginView, meta: { layout: 'auth' } },

  { path: '/dashboard', component: CPanelView, meta: { requiresAuth: true } },
  { path: '/config/usuarios', component: UsuariosView, meta: { requiresAuth: true } },
  { path: '/config/roles', component: RolesView, meta: { requiresAuth: true } },
  { path: '/config/medidores', component: MedidoresView, meta: { requiresAuth: true } },
  { path: '/config/areas', component: AreasView, meta: { requiresAuth: true } },
  { path: '/config/qr', component: QrGeneradosView, meta: { requiresAuth: true } },
  { path: '/config', component: ConfigIndexView, meta: { requiresAuth: true } },
  { path: '/info/Api', component: API, meta: { requiresAuth: true } },
  { path: '/info/reportes', name: 'MedicionesReportes', component: () => import('@/views/MedicionesReportes.vue'), meta: { requiresAuth: true } },
  { path: '/medicion', name: 'Recolección', component: () => import('@/views/Medicion.vue'), meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiereAuth = to.matched.some(record => record.meta.requiresAuth);
  const estaAutenticado = authService.isAuthenticated();

  if (requiereAuth && !estaAutenticado) {
    next('/login');
  } else if ((to.path === '/' || to.path === '/login') && estaAutenticado) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
