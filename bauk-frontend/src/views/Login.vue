<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Login</h3>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Entrando...' : 'Entrar' }}
              </button>
              <router-link to="/register">Cadastrar</router-link>
            </div>
            <div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login } from '../services/api'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const res = await login({ username: username.value, password: password.value })
    // Tolerância: procura por token em campos comuns
    const token = res.data?.token ?? res.data?.access_token ?? res.data?.data?.token
    if (!token) throw new Error('Token não retornado pela API. Verifique o campo de resposta.')

    auth.setToken(token)
    await auth.fetchMe()
    router.push('/home')
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? err.message ?? 'Erro ao logar'
  } finally {
    loading.value = false
  }
}
</script>
