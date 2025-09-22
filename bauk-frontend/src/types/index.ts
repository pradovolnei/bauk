export interface User {
  id: number
  username: string
  name?: string
  balance?: number
}

export interface Transaction {
  id: number
  type: 'cash-in' | 'cash-out' | string
  amount: number
  created_at: string
  from_username?: string
  to_username?: string
  description?: string
}
