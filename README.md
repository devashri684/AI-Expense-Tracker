# 💰 AI-Powered Personal Expense Tracker & Financial Copilot

A full-stack personal finance application built with **Java 17, Spring Boot 3, React, MySQL, and Google Gemini AI**.

The application helps users track income and expenses, automatically extract transaction details from receipt images using **Gemini Vision**, visualize spending patterns, and receive personalized financial insights through an **AI Financial Copilot**.

---

## 📸 Project Screenshots

### 🔐 Login & Registration
<img width="1917" height="1080" alt="Screenshot 2026-09-07 123032" src="https://github.com/user-attachments/assets/2f70f315-c36f-4861-a27b-481648867db4" />
![Login Page](screenshots/login.png)

### 📊 Financial Dashboard

![Dashboard](screenshots/dashboard.png)

### 💰 Expense Management

![Expense Management](screenshots/expense-management.png)

### 📸 AI Receipt Scanner

![AI Receipt Scanner](screenshots/receipt-scanner.png)

### 🧠 AI Financial Copilot

![AI Financial Copilot](screenshots/financial-copilot.png)

---

## ✨ Features

## ✨ Features

### 🔐 Secure Authentication

* User registration and login
* JWT-based authentication
* Stateless authentication using Spring Security
* User-specific expense data isolation
* Protected REST APIs

### 💰 Expense & Income Management

* Create income and expense transactions
* View transaction history
* Update existing transactions
* Delete transactions
* Categorize transactions
* Automatically display latest transactions first

### 📸 AI-Powered Receipt Scanning

Upload a receipt image and let **Google Gemini Multimodal AI** extract important information automatically.

The AI identifies:

* 🏪 Merchant
* 💰 Amount
* 📅 Transaction date
* 🏷️ Expense category

The extracted information is returned to the frontend and can be used to automatically populate the expense form.

**Workflow:**

```text
Receipt Image
      ↓
React Receipt Uploader
      ↓
Spring Boot REST API
      ↓
Gemini Multimodal AI
      ↓
Structured JSON Response
      ↓
Expense Form Auto-Fill
```

### 🧠 AI Financial Copilot

The application includes an AI-powered financial assistant that analyzes the user's financial data and provides:

* Executive spending summaries
* Spending observations
* Savings recommendations
* Income vs expense analysis
* Financial risk classification
* Budget and affordability guidance
* Interactive financial Q&A

Example:

```text
User:
Can I afford to spend ₹5,000 this month?

Copilot:
Based on your current income, expenses, and estimated monthly
surplus, spending ₹5,000 may be affordable while maintaining
your current savings level.
```

> ⚠️ The Copilot provides informational financial guidance based on application data and is not professional financial advice.

---

## 🛡️ Resilient AI Architecture

The AI layer is designed to handle failures from external AI services gracefully.

### Multi-Model Fallback

The backend can attempt alternative Gemini models when an upstream model request fails.

```text
Primary Gemini Model
        ↓
     Failure?
        ↓
Alternative Model
        ↓
     Failure?
        ↓
Deterministic Fallback
```

### Offline Fallback Analysis

When AI requests cannot be completed because of quota limits, rate limits, or other upstream failures, the application can fall back to deterministic calculations based on the user's transaction data.

This allows core financial analysis to remain available even when the external AI service is unavailable.

### Defensive JSON Processing

The backend validates and sanitizes AI responses before converting them into application DTOs.

This helps prevent malformed AI output from breaking the frontend.

---

## 📊 Financial Dashboard

The dashboard provides a visual overview of the user's financial activity.

### Key Performance Indicators

* 💰 Total Balance
* 📥 Total Income
* 📤 Total Expenses
* 📈 Net Savings Percentage

### 7-Day Expense Analysis

A rolling seven-day bar chart displays daily spending activity.

```text
Monday     ███████
Tuesday    ███████████
Wednesday  ████
Thursday   █████████
Friday     ██████
Saturday   █████████████
Sunday     ███
```

### Category Distribution

A donut chart displays the distribution of expenses across categories using **Recharts**.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │      React Frontend      │
                         │       Vite + React       │
                         │                          │
                         │ • Dashboard              │
                         │ • Expense Management     │
                         │ • Receipt Upload         │
                         │ • AI Copilot             │
                         │ • Recharts Analytics     │
                         └────────────┬─────────────┘
                                      │
                              HTTP / REST API
                              Bearer JWT
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    Spring Boot Backend   │
                         │         Java 17          │
                         │                          │
                         │ • REST Controllers       │
                         │ • Spring Security        │
                         │ • JWT Authentication    │
                         │ • Expense Service        │
                         │ • AI Advisor Service     │
                         │ • JPA Repositories      │
                         └───────┬──────────┬────────┘
                                 │          │
                       JPA / SQL │          │ HTTPS / JSON
                                 │          │
                                 ▼          ▼
                    ┌────────────────┐  ┌─────────────────┐
                    │ MySQL Database │  │ Google Gemini AI│
                    │                │  │                 │
                    │ • Users        │  │ • Receipt OCR   │
                    │ • Expenses     │  │ • Extraction    │
                    │ • Categories   │  │ • Insights      │
                    └────────────────┘  │ • Copilot       │
                                        └─────────────────┘
```

---

## 🧩 Project Structure

```text
AI-ExpenseTracker/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/AI_ExpenseTracker/
│   │       │
│   │       ├── Controller/
│   │       │   ├── AuthController
│   │       │   ├── ExpenseController
│   │       │   └── AiAdvisorController
│   │       │
│   │       ├── Dto/
│   │       │   ├── AiInsightsResponseDto
│   │       │   └── AiChatResponseDto
│   │       │
│   │       ├── Entity/
│   │       │   ├── User
│   │       │   ├── Expense
│   │       │   ├── Category
│   │       │   └── TransactionType
│   │       │
│   │       ├── Repository/
│   │       │   ├── UserRepository
│   │       │   └── ExpenseRepository
│   │       │
│   │       └── Service/
│   │           ├── ExpenseService
│   │           └── AiAdvisorService
│   │
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ReceiptUploader
    │   │   ├── ExpenseForm
    │   │   ├── Navbar
    │   │   └── Sidebar
    │   │
    │   ├── pages/
    │   │   ├── Dashboard
    │   │   ├── AddExpense
    │   │   └── AiAdvisor
    │   │
    │   └── services/
    │       └── API services
    │
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

| Category                | Technologies                 |
| ----------------------- | ---------------------------- |
| **Language**            | Java 17, JavaScript          |
| **Backend**             | Spring Boot 3, Spring MVC    |
| **Security**            | Spring Security, JWT         |
| **Persistence**         | Spring Data JPA, Hibernate   |
| **Database**            | MySQL 8                      |
| **AI**                  | Google Gemini Multimodal API |
| **Frontend**            | React 18, Vite               |
| **Charts**              | Recharts                     |
| **Styling**             | CSS3, Glassmorphism          |
| **API Communication**   | REST APIs, JSON              |
| **Build Tool**          | Maven, npm                   |
| **Testing / API Tools** | Postman                      |
| **Development Tools**   | IntelliJ IDEA, VS Code       |
| **Version Control**     | Git, GitHub                  |

---

## 🔌 REST API

### Authentication

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| `POST` | `/api/auth/register` | Register a new user              |
| `POST` | `/api/auth/login`    | Authenticate user and obtain JWT |

### Expenses

| Method   | Endpoint             | Description                           |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/api/expenses`      | Get authenticated user's transactions |
| `POST`   | `/api/expenses`      | Create income/expense                 |
| `PUT`    | `/api/expenses/{id}` | Update transaction                    |
| `DELETE` | `/api/expenses/{id}` | Delete transaction                    |

### AI

| Method | Endpoint                     | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| `POST` | `/api/expenses/scan-receipt` | Extract transaction data from receipt |
| `GET`  | `/api/ai/insights`           | Generate financial insights           |
| `POST` | `/api/ai/copilot`            | Ask the AI Financial Copilot          |

---

## 🔄 Application Flow

### User Authentication

```text
User
 ↓
Login / Register
 ↓
Spring Security
 ↓
JWT Generation
 ↓
React Stores Token
 ↓
Bearer Token on API Requests
```

### Expense Creation

```text
React Expense Form
        ↓
POST /api/expenses
        ↓
Spring Controller
        ↓
Expense Service
        ↓
Spring Data JPA
        ↓
MySQL
```

### Receipt Processing

```text
Receipt Image
      ↓
Multipart HTTP Request
      ↓
Spring Boot
      ↓
AiAdvisorService
      ↓
Gemini Multimodal API
      ↓
Extract Structured Data
      ↓
DTO
      ↓
React Expense Form
```

### Financial Insights

```text
MySQL Transactions
        ↓
Expense Repository
        ↓
Financial Data Aggregation
        ↓
AI Advisor Service
        ↓
Gemini AI
        ↓
Structured Insights
        ↓
React Dashboard
```

---

## ⚙️ Local Installation

### Prerequisites

Make sure you have:

* Java JDK 17+
* Node.js 18+
* npm
* MySQL 8+
* Git
* Google Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-ExpenseTracker.git

cd AI-ExpenseTracker
```

---

### 2. Create MySQL Database

Open MySQL Workbench or the MySQL terminal:

```sql
CREATE DATABASE expensetracker;
```

---

### 3. Configure Backend

Open:

```text
backend/src/main/resources/application.properties
```

Configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expensetracker?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

gemini.api.key=YOUR_GEMINI_API_KEY

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

> 🔒 Never commit your Gemini API key, database password, JWT secret, or other credentials to GitHub.

---

### 4. Run Backend

```bash
cd backend
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

### 5. Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🧪 Testing

API endpoints can be tested using **Postman**.

Example authentication flow:

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Add Authorization Header
   ↓
Bearer <JWT>
   ↓
Access protected APIs
```

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔒 Security Considerations

The application implements:

* JWT-based authentication
* Stateless authentication
* Protected REST endpoints
* User-specific data access
* Spring Security request filtering
* API-level authorization
* External API key configuration through application properties

Sensitive credentials should be supplied through environment variables or secure deployment configuration in production.

---

## 📸 Screenshots

Add screenshots of your main application screens here.

### Dashboard

```text
Add dashboard screenshot here
```

### AI Receipt Scanner

```text
Add receipt scanning screenshot here
```

### AI Financial Copilot

```text
Add Copilot screenshot here
```

### Expense Management

```text
Add expense management screenshot here
```

---

## 🎯 What I Learned

Through this project, I gained practical experience with:

* Building REST APIs using Spring Boot
* Designing layered backend architecture
* Spring Data JPA and Hibernate
* MySQL database integration
* JWT authentication with Spring Security
* React frontend development
* REST API integration between React and Spring Boot
* Multimodal AI integration using Google Gemini
* Prompt engineering and structured AI responses
* Handling external API failures
* Data aggregation for financial analytics
* Git and GitHub project management

---

## 👩‍💻 Author

**Devashri Rewanwar**

B.Tech — Electronics & Telecommunication Engineering
IoT Honors | Walchand Institute of Technology, Solapur

### Connect With Me

* GitHub: `https://github.com/devashri684`
* LinkedIn: `https://www.linkedin.com/in/devashrirewanwar/`

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

### 📌 Project Highlights

```text
Java 17
Spring Boot 3
Spring Security + JWT
Spring Data JPA
MySQL
React
Google Gemini Multimodal AI
AI Financial Copilot
REST APIs
Recharts
Git + GitHub
```
