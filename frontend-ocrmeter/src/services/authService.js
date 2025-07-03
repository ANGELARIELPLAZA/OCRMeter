import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

// Estado reactivo de login
const isLoggedIn = ref(!!localStorage.getItem('token'))

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión')
        }

        if (data.token) {
            localStorage.setItem('token', data.token)
            isLoggedIn.value = true // ✅ actualiza el estado reactivo
        }

        return data
    } catch (error) {
        throw error
    }
}

function logout() {
    localStorage.removeItem('token')
    isLoggedIn.value = false // ✅ actualiza también al cerrar sesión
    window.location.reload() // ✅ fuerza un refresh completo

}

function isAuthenticated() {
    return !!localStorage.getItem('token')
}

function getToken() {
    return localStorage.getItem('token')
}

export default {
    login,
    logout,
    isAuthenticated,
    getToken,
    isLoggedIn // ✅ exporta el ref reactivo
}
