import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

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

    if (data.token && data.user) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.user)) // ✅ guarda usuario
      isLoggedIn.value = true
    }

    return data
  } catch (error) {
    throw error
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario') // ✅ limpia usuario
  isLoggedIn.value = false
  window.location.reload()
}

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

function getToken() {
  return localStorage.getItem('token')
}

function getUsuario() {
  const raw = localStorage.getItem('usuario')
  return raw ? JSON.parse(raw) : null
}

export default {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUsuario,
  isLoggedIn
}
