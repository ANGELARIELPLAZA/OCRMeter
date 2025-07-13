import { ref } from 'vue'
import CryptoJS from 'crypto-js'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY
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

      // 🔐 Encriptar usuario
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(data.user), SECRET_KEY).toString()
      localStorage.setItem('usuario', encryptedUser)

      localStorage.setItem('usuarioName', data.user.name)
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
  localStorage.removeItem('usuarioName') // ✅ limpia usuario

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
  const encrypted = localStorage.getItem('usuario')
  if (!encrypted || typeof encrypted !== 'string') return null

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (!decrypted) return null
    return JSON.parse(decrypted)
  } catch (err) {
    console.error('❌ Error al desencriptar usuario:', err)
    return null
  }
}



export default {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUsuario,
  isLoggedIn
}
