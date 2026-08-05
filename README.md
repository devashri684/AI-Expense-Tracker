# 💰 AI-Powered Expense Tracker

<p align="center">

![GitHub stars](https://img.shields.io/github/stars/devashri684/AI-Expense-Tracker?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/devashri684/AI-Expense-Tracker?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/devashri684/AI-Expense-Tracker?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/devashri684/AI-Expense-Tracker?style=for-the-badge)

</p>

<p align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge\&logo=java)
![Spring Boot](https://img.shields.io/badge/SpringBoot-Framework-brightgreen?style=for-the-badge\&logo=springboot)
![React](https://img.shields.io/badge/React-JS-blue?style=for-the-badge\&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge\&logo=mysql)
![Vite](https://img.shields.io/badge/Vite-BuildTool-purple?style=for-the-badge\&logo=vite)

</p>

---

## 💳 Full-Stack Expense Tracker & Analytics Dashboard

A robust, production-grade full-stack personal finance and expense management platform designed to track daily transactions, calculate financial metrics, and visualize spending patterns through interactive analytics dashboards.

---

## 🚀 Key Features

* ✅ **Complete CRUD Operations:** Seamlessly add, update, delete, and fetch expense records in real time
* 📊 **Category Tracking:** Organize expenses dynamically across various spending categories
* 💹 **Financial Summaries & Metrics:** Automatically computes total balance, income, expenses, and net savings
* 📈 **Data Visualization:** Interactive charts and breakdown views powered by React and Recharts
* 🔗 **RESTful Architecture:** Decoupled client-server model using secure, stateless backend APIs

---

## 🏗️ System Architecture

```text
Expense-Tracker
│
├── frontend (React.js SPA)
│   └── Communicates via Axios & Vite Proxy
│
├── backend (Spring Boot REST API)
│   └── Managed via Spring Data JPA & Hibernate
│
└── MySQL Database
    └── Relational data persistence
```

---

## 🛠️ Tech Stack

### 🌐 Frontend

* React.js
* Vite
* Axios
* Recharts & CSS

### ⚙️ Backend

* Java & Spring Boot
* Spring Data JPA & Hibernate
* Spring Security

### 🗄️ Database & Tools

* MySQL
* Git & GitHub
* Maven
* IntelliJ IDEA & VS Code

---

## 🔌 Backend API Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/expenses`      | Get all expenses  |
| GET    | `/api/expenses/{id}` | Get expense by ID |
| POST   | `/api/expenses`      | Add new expense   |
| PUT    | `/api/expenses/{id}` | Update expense    |
| DELETE | `/api/expenses/{id}` | Delete expense    |

---

## ⚙️ How to Run Locally

### 📌 Prerequisites

* Java 17+
* Node.js
* MySQL
* Maven

---

### 🖥️ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Runs on: `http://localhost:8080`

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## 👩‍💻 Author

**Devashri Rewanwar**

🔗 https://github.com/devashri684

---

⭐ If you like this project, consider giving it a star!
