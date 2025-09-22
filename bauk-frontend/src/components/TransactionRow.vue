<template>
  <tr>
    <td>{{ formattedDate }}</td>
    <td>{{ tx.type }}</td>
    <td>{{ tx.from_username ?? '-' }}</td>
    <td>{{ tx.to_username ?? '-' }}</td>
    <td class="text-end">{{ formatCurrency(tx.amount) }}</td>
    <td>{{ tx.description ?? '' }}</td>
  </tr>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Transaction } from '../types'
const props = defineProps<{ tx: Transaction }>()
const formattedDate = computed(() => new Date(props.tx.created_at).toLocaleString('pt-BR'))
function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>
