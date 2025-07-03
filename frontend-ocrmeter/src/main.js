import './assets/main.css'

import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.component('ApexChart', VueApexCharts)
app.mount('#app')