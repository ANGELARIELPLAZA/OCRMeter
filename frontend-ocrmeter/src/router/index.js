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
import MedicionesReportes from '@/views/MedicionesReportes.vue';
import Medicion from '@/views/Medicion.vue';
import PerfilView from '@/views/PerfilView.vue';

const routes = [
  { path: '/', component: LoginView, meta: { layout: 'auth' } },
  { path: '/login', component: LoginView, meta: { layout: 'auth' } },

  { path: '/dashboard', component: CPanelView, meta: { requiresAuth: true } },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: { requiresAuth: true }
  },

  // 🛠 Configuración (solo admin)
  { path: '/config/usuarios', component: UsuariosView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/config/roles', component: RolesView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/config/medidores', component: MedidoresView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/config/areas', component: AreasView, meta: { requiresAuth: true, roles: ['admin',] } },
  { path: '/config/qr', component: QrGeneradosView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/config', component: ConfigIndexView, meta: { requiresAuth: true, roles: ['admin'] } },

  // 📊 Información general
  { path: '/info/Api', component: API, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/info/reportes', name: 'MedicionesReportes', component: MedicionesReportes, meta: { requiresAuth: true, roles: ['admin', 'supervisor'] } },
  { path: '/medicion', name: 'Recolección', component: Medicion, meta: { requiresAuth: true, roles: ['admin', 'supervisor', 'Operador'] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ✅ Middleware global para auth y roles
router.beforeEach((to, from, next) => {
  const requiereAuth = to.matched.some(record => record.meta.requiresAuth);
  const estaAutenticado = authService.isAuthenticated();
  const user = authService.getUsuario(); // Debe retornar { name, email, role }

  if (requiereAuth && !estaAutenticado) {
    next('/login');
  } else if ((to.path === '/' || to.path === '/login') && estaAutenticado) {
    next('/dashboard');
  } else if (to.meta.roles && (!user || !to.meta.roles.includes(user.role))) {
    alert('Acceso denegado: no tienes permisos para esta sección.');
    next('/dashboard'); // Puedes redirigir a otra vista segura
  } else {
    next();
  }
});

export default router;
