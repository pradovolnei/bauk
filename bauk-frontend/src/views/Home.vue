<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card rounded shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Saldo</h5>
            <h2>{{ formatCurrency(user?.balance ?? 0) }}</h2>
            <p class="text-muted">Usuário: {{ user?.username }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card rounded shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Transferir</h5>
            <form @submit.prevent="doTransfer" class="row g-2">
              <div class="col-md-6">
                <input v-model="toUsername" class="form-control" placeholder="Username do beneficiário" required />
              </div>
              <div class="col-md-3">
                <input v-model.number="amount" type="number" step="0.01" min="0.01" class="form-control" placeholder="Valor" required />
              </div>
              <div class="col-md-3 d-grid">
                <button class="btn btn-primary" :disabled="transferLoading">{{ transferLoading ? 'Enviando...' : 'Enviar' }}</button>
              </div>
              <div class="col-12 mt-2">
                <input v-model="description" class="form-control" placeholder="Descrição (opcional)" />
              </div>
            </form>
            <div v-if="transferError" class="mt-2 alert alert-danger">{{ transferError }}</div>
            <div v-if="transferSuccess" class="mt-2 alert alert-success">{{ transferSuccess }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Filtros de transações</h5>
        <form @submit.prevent="fetchTransactions" class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label">Data de</label>
            <input v-model="dateFrom" type="date" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Data até</label>
            <input v-model="dateTo" type="date" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Tipo</label>
            <select v-model="typeFilter" class="form-select">
              <option value="">Todos</option>
              <option value="cash-in">cash-in</option>
              <option value="cash-out">cash-out</option>
            </select>
          </div>
          <div class="col-md-3 d-grid">
            <button class="btn btn-outline-primary">Filtrar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabela -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>De</th>
                <th>Para</th>
                <th class="text-end">Valor</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              <TransactionRow v-for="tx in transactions" :key="tx.id" :tx="tx" />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center my-3">
      Carregando...
    </div>
    <div v-if="error" class="mt-2 alert alert-danger">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getTransactions, createTransfer } from '../services/api'
import TransactionRow from '../components/TransactionRow.vue'

const auth = useAuthStore()
const user = computed(() => auth.user)

const transactions = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const transferLoading = ref(false)
const transferError = ref('')
const transferSuccess = ref('')

const toUsername = ref('')
const amount = ref<number | null>(null)
const description = ref('')

// filtros
const dateFrom = ref<string | null>(null)
const dateTo = ref<string | null>(null)
const typeFilter = ref('')

async function fetchTransactions() {
  loading.value = true
  error.value = ''
  try {
    const params: any = {}
    if (dateFrom.value) params.date_from = dateFrom.value
    if (dateTo.value) params.date_to = dateTo.value
    if (typeFilter.value) params.type = typeFilter.value

    const res = await getTransactions(params)
    transactions.value = res.data || []
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Erro ao buscar transações'
  } finally {
    loading.value = false
  }
}

async function doTransfer() {
  transferError.value = ''
  transferSuccess.value = ''
  if (!toUsername.value || !amount.value || amount.value <= 0) {
    transferError.value = 'Informe beneficiário e valor válido'
    return
  }
  transferLoading.value = true
  try {
    const payload = { to_username: toUsername.value, amount: amount.value, description: description.value || undefined }
    await createTransfer(payload)
    transferSuccess.value = 'Transferência realizada com sucesso'
    // atualiza histórico e saldo
    await auth.fetchMe()
    await fetchTransactions()
    toUsername.value = ''
    amount.value = null
    description.value = ''
  } catch (err: any) {
    transferError.value = err?.response?.data?.message ?? 'Erro ao realizar transferência'
  } finally {
    transferLoading.value = false
  }
}

onMounted(async () => {
  if (!auth.user) {
    try { await auth.fetchMe() } catch { /* ignora */ }
  }
  await fetchTransactions()
})
</script>
