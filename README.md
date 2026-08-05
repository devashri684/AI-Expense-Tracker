# 💰 AI-Powered Expense Tracker

# 💳 Full-Stack Expense Tracker & Analytics Dashboard

A robust, production-grade full-stack personal finance and expense management platform designed to track daily transactions, calculate financial metrics, and visualize spending patterns through interactive analytics dashboards.

---

## 🚀 Key Features

* **Complete CRUD Operations:** Seamlessly add, update, delete, and fetch expense records in real time.
* **Category Tracking:** Organize expenses dynamically across various spending categories.
* **Financial Summaries & Metrics:** Automatically computes total balances, income, expenses, and net savings.
* **Data Visualization:** Interactive charts and breakdown views powered by React and Recharts.
* **RESTful Architecture:** Built on a decoupled client-server model using secure, stateless backend APIs.

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

## 🛠️ Tech Stack

## Frontend
React.js (Component-based UI architecture)

Vite (Next-generation frontend tooling & proxy routing)

Axios (HTTP client with custom error-handling interceptors)

Recharts & Modern CSS (Data visualization and responsive layout design)

## Backend
Java & Spring Boot (Core business logic and enterprise REST APIs)

Spring Data JPA & Hibernate (Object-Relational Mapping & data management)

Spring Security 6 (Stateless filter-chain and CORS configuration)

## Database & Tools
MySQL (Relational database management)

Git & GitHub (Version control and source management)

Maven (Dependency management and build automation)

IntelliJ IDEA & VS Code (Development environments)

## 🔌 Backend API Endpoints

### Expense APIs

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/expenses`      | Get all expenses  |
| GET    | `/api/expenses/{id}` | Get expense by ID |
| POST   | `/api/expenses`      | Add new expense   |
| PUT    | `/api/expenses/{id}` | Update expense    |
| DELETE | `/api/expenses/{id}` | Delete expense    |

---

## ⚙️ How to Run Locally

### Prerequisites

Install:

* Java 17+
* Node.js
* MySQL
* Maven

---

## Backend Setup

Navigate to backend:

```bash
cd backend
```

Configure MySQL database in:

```
src/main/resources/application.properties
```

Run Spring Boot application:

```bash
mvn spring-boot:run
```

Backend will start on:

```
http://localhost:8080
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```

## 👩‍💻 Author

**Devashri Rewanwar**

GitHub:
https://github.com/devashri684

---

⭐ If you like this project, consider giving it a star!
