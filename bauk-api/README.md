# 💸 API de Transferências Internas

Uma aplicação **web full-stack** desenvolvida com **NestJS** e **Docker** que permite aos usuários realizar transferências de dinheiro entre si.  
O projeto é focado em **boas práticas de arquitetura, segurança e escalabilidade**.

---

## 🚀 Stack de Tecnologias

- **Backend:** Node.js (NestJS + TypeORM)  
- **Banco de Dados:** PostgreSQL  
- **Contêineres:** Docker & Docker Compose  
- **Autenticação:** JWT (JSON Web Tokens)  
- **Validação & Segurança:** Class Validator, Bcrypt  

---

## ✨ Funcionalidades da API

- 🔐 **Autenticação:** Cadastro e login de usuários com JWT  
- 💰 **Contas:** Consulta de saldo em tempo real  
- 🔄 **Transações:** Transferências entre usuários (cash-in / cash-out)  
- 📜 **Histórico:** Listagem e filtros de transações (tipo e data)  

---

## 📋 Pré-requisitos

Antes de iniciar, verifique se possui instalado em sua máquina:

- Node.js (>= 14.x)  
- npm ou yarn  
- Docker + Docker Compose  

---

## ⚙️ Configuração e Execução

### 1️⃣ Clonar o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd bank-api
```

### 2️⃣ Criar arquivo `.env`

Exemplo de configuração:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=bank_db
JWT_SECRET=sua-chave-secreta-muito-segura
```

### 3️⃣ Subir containers do banco de dados

```bash
docker-compose up -d db
```

### 4️⃣ Instalar dependências e rodar a API

```bash
npm install
npm run start:dev
```

A API estará disponível em: **http://localhost:3000**

---

## 📡 Endpoints da API

Base URL: `http://localhost:3000`

### 🔐 Autenticação

#### ➕ Cadastro de usuário
`POST /auth/signup`  
Cria um novo usuário com saldo inicial de **R$ 100,00**.

```json
{
  "username": "novo.usuario",
  "password": "SenhaSegura123"
}
```

#### 🔑 Login de usuário
`POST /auth/login`  

```json
{
  "username": "joao.silva",
  "password": "Password123"
}
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### 💰 Contas

#### Consultar saldo
`GET /accounts/balance`  

**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Resposta:**

```json
{
  "balance": 100.00
}
```

---

### 🔄 Transações

#### Realizar transferência
`POST /transactions/transfer`  

```json
{
  "username": "usuario.destino",
  "value": 25.50
}
```

**Regras:**  
- Usuário deve ter saldo suficiente  
- Não é permitido transferir para si mesmo  
- Cria registro na tabela `Transactions`  

---

#### Histórico de transações
`GET /transactions`  

**Query Params:**  
- `?type=cash-out` → apenas saídas  
- `?type=cash-in` → apenas entradas  
- `?date=YYYY-MM-DD` → por data  

**Exemplo:**  
```
http://localhost:3000/transactions?type=cash-out&date=2025-09-21
```

**Resposta:**

```json
[
  {
    "id": "c1f7b8f9-e3c4-4d5a-8b1d-0f2c3a4e5f6d",
    "value": 25.50,
    "createdAt": "2025-09-21T15:00:00.000Z",
    "type": "cash-out",
    "debitedAccountId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "creditedAccountId": "f1e2d3c4-b5a6-9b8c-7d6e-5f4a3b2c1d0e"
  }
]
```

---

## 📌 Observações

- ✅ Segue princípios de **Clean Architecture**  
- ✅ Código modular, testável e escalável  
- ✅ Fácil integração com frontend e serviços externos  

---

## 📜 Licença

Este projeto está sob a licença de **VOLNEI PRADO**.  
Sinta-se livre para usar e contribuir. 🚀
