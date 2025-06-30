<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const router = useRouter()

function irARuta(ruta) {
    router.push(ruta)
}

const configCards = ref([
    { title: 'Usuarios', icon: 'bi bi-people', ruta: '/config/usuarios' },
    { title: 'Roles', icon: 'bi bi-person-badge', ruta: '/config/roles' },
    { title: 'Medidores', icon: 'bi bi-speedometer2', ruta: '/config/medidores' },
    { title: 'Áreas', icon: 'bi bi-diagram-3', ruta: '/config/areas' },
    { title: 'QR Generados', icon: 'bi bi-qr-code', ruta: '/config/qr' }
])
</script>

<template>
    <div>
        <Breadcrumb />
        <h5 class="mb-4">Catálogos del Sistema</h5>
        <div class="row">
            <div class="col-md-3 mb-3" v-for="card in configCards" :key="card.title">
                <div class="card shadow-sm text-center tarjeta-hover" @click="irARuta(card.ruta)"
                    style="cursor: pointer;">
                    <div class="card-body">
                        <i :class="card.icon" style="font-size: 2rem;"></i>
                        <h6 class="mt-2">{{ card.title }}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
