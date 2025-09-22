<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Cadastro</h3>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Nome</label>
              <input v-model="name" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Senha</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="d-flex justify-content-between">
              <button class="btn btn-success" :disabled="loading">{{ loading ? 'Salvando...' : 'Cadastrar' }}</button>
              <router-link to="/login">Já tenho conta</router-link>
            </div>
            <div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
            <div v-if="success" class="mt-3 alert alert-success">{{ success }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, login } from '../services/api'
import { useAuthStore } from '../stores/auth'

const name = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await register({ username: username.value, password: password.value, name: name.value })
    success.value = 'Cadastro realizado. Efetuando login...'

    // opcional: efetua login automático
    const res = await login({ username: username.value, password: password.value })
    const token = res.data?.token ?? res.data?.access_token
    if (!token) throw new Error('Token não retornado')
    auth.setToken(token)
    await auth.fetchMe()
    router.push('/home')
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? err.message ?? 'Erro ao cadastrar'
  } finally {
    loading.value = false
  }
}
</script>
