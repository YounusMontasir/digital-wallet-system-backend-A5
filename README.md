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
