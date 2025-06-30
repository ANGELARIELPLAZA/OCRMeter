<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// Crear los segmentos del breadcrumb
const crumbs = computed(() => {
    const path = route.path
    const segments = path.split('/').filter(Boolean)

    return segments.map((segment, index) => {
        return {
            label: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
            path: '/' + segments.slice(0, index + 1).join('/')
        }
    })
})

function navigateTo(path) {
    router.push(path)
}
</script>

<template>
    <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#" @click.prevent="navigateTo('/dashboard')">Inicio</a>
            </li>
            <li v-for="(crumb, index) in crumbs" :key="crumb.path" class="breadcrumb-item"
                :class="{ active: index === crumbs.length - 1 }" aria-current="page">
                <span v-if="index === crumbs.length - 1">{{ crumb.label }}</span>
                <a v-else href="#" @click.prevent="navigateTo(crumb.path)">{{ crumb.label }}</a>
            </li>
        </ol>
    </nav>
</template>

<style scoped>

</style>
