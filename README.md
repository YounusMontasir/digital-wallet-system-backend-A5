# 💸Digital Wallet System 

A robust and secure digital wallet management system inspired by platforms like **bKash** and **Nagad**, built with **TypeScript**, **Express.js**, **MongoDB**, and **Zod**. This system supports **User**, **Agent**, and **Admin** roles with full **wallet and transaction management** features.

---

## 🚀 Features

- 🔐 **Authentication** using JWT and bcrypt
- 🎭 **Role-Based Authorization**: User, Agent, Admin
- 🏦 **Wallet Operations**:
  - Add Money
  - Send Money
  - Cash Out
- 🧱 **Transactional Logic** with validation and atomicity
- 📦 **Modular Architecture** (MVC pattern)
- 🔁 **RESTful API Endpoints**
- ✅ **Data Validation** using Zod
- 🌐 **MongoDB with Mongoose**

---

## 🧑‍💻 Tech Stack

| Technology     | Usage                        |
|----------------|------------------------------|
| Node.js        | Runtime                      |
| Express.js     | Web framework                |
| TypeScript     | Static typing                |
| MongoDB        | Database                     |
| Mongoose       | ODM for MongoDB              |
| Zod            | Input validation             |
| bcryptjs       | Password hashing             |
| JSON Web Token | Authentication               |

---

## 📁 Project Structure

```bash
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   └── transaction/
├── middlewares/
├── config/
├── utils/
└── app.ts

---

## 🚀 Endpoints

### 👤 User Endpoints
```http
POST   /api/user/create
GET    /api/user/
PATCH  /api/user/update/:id
GET    /api/user/:id

### 💼 Wallet Endpoints
```http
GET    /api/wallet/
PATCH  /api/wallet/update/:id
GET    /api/wallet/:id

### 💸 Transaction Endpoints
```http
POST   /api/transaction/add-money
POST   /api/transaction/send-money
POST   /api/transaction/cash-out
GET    /api/transaction/
GET    /api/transaction/my-transaction/:id

### 🔐 Auth Endpoints
```http
POST   /api/auth/login


### 🚀 Transaction Features 🚀

## addMoney
- Allows a user or agent to add money to another user's wallet.
- Validates sender and receiver existence and status (active, not blocked or deleted).
- Prevents agents from sending money to other agents or admins.
- Checks sender’s wallet status and balance before proceeding.
- Applies a commission of 50 if the amount is 25,000 or more; otherwise no commission.
- Updates both sender’s and receiver’s wallet balances atomically within a transaction.

## sendMoney
- Enables a user to send money to another user’s wallet.
- Validates sender and receiver existence and status (active, not blocked or deleted).
- Disallows sending money to agents or admins.
- Checks sender’s wallet status and balance, including transaction charge calculation based on amount.
- Charges fees based on amount slabs, and applies a 50 commission for amounts ≥ 25,000.
- Atomically updates sender and receiver wallet balances within a transaction.

## cashOut
- Allows a user to cash out money through an agent.
- Validates sender and receiver existence and status.
- Only allows cash out if the receiver is an agent (not user or admin).
- Checks wallet statuses and sender’s balance.
- Charges a cash-out fee based on amount slabs.
- Atomically updates sender and receiver wallet balances within a transaction.
