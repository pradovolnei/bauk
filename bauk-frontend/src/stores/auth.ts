import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { me as meRequest } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)

  function setToken(t: string | null) {
    token.value = t
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }

  function setUser(u: any | null) {
    user.value = u
    if (u) localStorage.setItem('user', JSON.stringify(u))
    else localStorage.removeItem('user')
  }

  async function fetchMe() {
    try {
      const res = await meRequest()
      setUser(res.data)
      return res.data
    } catch (err) {
      setToken(null)
      setUser(null)
      throw err
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return { token, user, setToken, setUser, fetchMe, logout }
})
