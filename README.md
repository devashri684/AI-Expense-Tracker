# 💰 AI-Powered Expense Tracker

A full-stack AI-powered expense management application built using **Spring Boot, React.js, and MySQL**. The application helps users track expenses, analyze spending patterns, manage budgets, and receive smart financial insights.

---

## 🚀 Features

* ✅ Add, update, and delete expenses
* ✅ Category-based expense tracking
* ✅ Monthly spending analysis
* ✅ Dashboard with expense insights
* ✅ Smart budget alerts
* ✅ Automated expense analysis
* ✅ Real-time financial summaries
* ✅ RESTful API-based backend
* ✅ Responsive user interface

---

## 🏗️ Project Architecture

```
AI-Expense-Tracker
│
├── frontend
│   └── React.js Application
│
├── backend
│   └── Spring Boot REST API
│
└── MySQL Database
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* REST APIs

### Database

* MySQL

### Tools

* IntelliJ IDEA
* VS Code
* Git & GitHub
* Maven
* Postman



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
