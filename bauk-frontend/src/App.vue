<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">BAUK</a>
      <div class="d-flex">
        <button v-if="isLogged" @click="logout" class="btn btn-outline-danger btn-sm">Logout</button>
        <router-link v-else to="/login" class="btn btn-primary btn-sm">Login</router-link>
      </div>
    </div>
  </nav>
  <div class="container my-4">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'  
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const isLogged = computed(() => !!auth.token)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
