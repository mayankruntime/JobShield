# 🛡️ JobShield

### AI-Powered Job Scam Detection System

JobShield is a full-stack web application designed to help users identify potentially fraudulent job opportunities before applying or sharing sensitive information.

The system combines **rule-based scam detection** with a **Machine Learning model** to analyze job descriptions and job URLs and generate a risk score, risk level, fraud probability, and reasons for the detected risk.

---

## 🚀 Features

* 🔐 User Registration & Login
* 🪪 JWT-based Authentication
* 🔑 Forgot & Reset Password
* 🔍 Job Description Analysis
* 🌐 Job URL Analysis
* 🤖 Machine Learning-based Scam Detection
* 📊 Risk Score & Risk Level
* 🚨 Scam Detection Reasons
* 📈 Fraud & Legitimate Probability
* 📚 User-specific Analysis History
* 📊 User Dashboard & Risk Statistics
* 👤 User Profile
* 🛡️ Input Validation & Security Checks
* ⚡ Graceful ML Service Error Handling
* 📱 Responsive Dark/Glass UI

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     ReactJS UI      │
                    │    Frontend : 5173  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │    Backend : 8080   │
                    └───────┬─────┬───────┘
                            │     │
                  ┌─────────┘     └──────────┐
                  ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     MySQL       │        │ FastAPI ML      │
        │    Database     │        │ Service : 8000  │
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │ TF-IDF + Linear │
                                  │      SVM        │
                                  └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* ReactJS
* Vite
* React Router
* CSS

### Backend

* Java
* Spring Boot
* Spring Security
* JWT
* REST APIs
* Hibernate / JPA
* BCrypt

### Database

* MySQL

### Machine Learning

* Python
* FastAPI
* Scikit-learn
* Pandas
* TF-IDF Vectorization
* Linear SVM
* Probability Calibration

---

## 🤖 Machine Learning Model

JobShield uses a text classification pipeline for detecting potentially fraudulent job advertisements.

### ML Pipeline

```text
Job Text
   ↓
Text Cleaning
   ↓
TF-IDF Vectorization
   ↓
Linear SVM
   ↓
Probability Calibration
   ↓
Fraud / Legitimate Prediction
```

The model uses:

* TF-IDF features
* Unigrams and bigrams
* English stop-word filtering
* Linear Support Vector Machine
* Class balancing
* Sigmoid probability calibration

### Model Evaluation

The current calibrated model achieved:

| Metric    | Result |
| --------- | -----: |
| Accuracy  | 99.24% |
| Precision | 97.40% |
| Recall    | 86.71% |
| F1 Score  | 91.74% |

Test-set confusion matrix:

```text
[[3399    4]
 [  23  150]]
```

The model also provides separate **Fraud Probability** and **Legitimate Probability** values.

---

## 🔍 Job Analysis

Users can analyze:

### 1. Job Description

Users can paste a job advertisement directly into JobShield.

The system analyzes the content using:

* Rule-based detection
* ML classification
* Suspicious keyword/pattern detection
* Scam-indicating combinations

### 2. Job URL

Users can provide a job advertisement URL.

JobShield:

```text
URL
 ↓
Fetch Web Page
 ↓
Extract Text
 ↓
Rule-based Analysis
 ↓
ML Prediction
 ↓
Risk Result
```

The extracted content is then processed through the existing analysis pipeline.

---

## 📊 Risk Assessment

JobShield generates:

* Risk Score
* Risk Level
* Risk Message
* Detection Reasons
* ML Prediction
* Fraud Probability
* Legitimate Probability

Example:

```text
Risk Score: 100/100
Risk Level: HIGH RISK
ML Prediction: FRAUDULENT
```

---

## 🔐 Security

JobShield includes multiple security measures:

* JWT authentication
* Protected API endpoints
* BCrypt password hashing
* Stateless Spring Security sessions
* User-specific analysis history
* Input validation
* Maximum content length validation
* URL validation
* Invalid JWT rejection
* Unauthorized API protection
* Graceful ML service failure handling

Security testing covered:

```text
Unauthorized API       → PASS
Invalid JWT             → PASS
Empty Input             → PASS
Invalid URL             → PASS
Large Input             → PASS
ML Service Unavailable  → PASS
User Data Isolation     → PASS
```

---

## 📁 Project Structure

```text
JobShield/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── jobshield/
│   │                   └── backend/
│   └── pom.xml
│
├── ml-service/
│   ├── data/
│   ├── models/
│   ├── app.py
│   ├── train_model.py
│   ├── evaluate_model.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

Install:

* Node.js
* Java JDK
* Maven
* MySQL
* Python
* Git

---

### 1. Clone Repository

```bash
git clone https://github.com/mayankruntime/JobShield.git
cd JobShield
```

---

### 2. Start MySQL

Create the JobShield database:

```sql
CREATE DATABASE jobshield;
```

Configure the database credentials in the backend configuration.

---

### 3. Start Spring Boot Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

### 4. Start ML Service

Open another terminal:

```bash
cd ml-service
```

Activate the virtual environment:

```bash
.\venv\Scripts\activate
```

Start FastAPI:

```bash
uvicorn app:app --reload --port 8000
```

ML service runs on:

```text
http://127.0.0.1:8000
```

---

### 5. Start React Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔄 Application Flow

```text
User
 ↓
Register / Login
 ↓
JWT Authentication
 ↓
Dashboard
 ↓
Analyze Job
 ↓
Spring Boot Backend
 ↓
 ┌──────────────────────┐
 │ Rule-Based Detection │
 └──────────┬───────────┘
            │
            ▼
      FastAPI ML Service
            │
            ▼
       TF-IDF + SVM
            │
            ▼
     Prediction + Probability
            │
            ▼
      Risk Score Generation
            │
            ▼
      Save Analysis History
            │
            ▼
       Display Result
```

---

## 🧪 Testing

JobShield was tested for:

* Authentication
* Authorization
* Input validation
* Invalid URLs
* Large inputs
* Invalid JWT tokens
* ML service availability
* User-specific data access
* Job description analysis
* URL analysis
* Dashboard statistics
* Analysis history
* Password reset flow

---

## 🔮 Future Scope

Possible future improvements include:

* Advanced NLP models
* Transformer-based classification
* Explainable AI improvements
* Real-time company verification
* Domain reputation analysis
* Job posting source verification
* Browser extension
* Mobile application
* Continuous model retraining
* Cloud deployment and scalable ML infrastructure

---

## 🎯 Project Objective

The primary objective of JobShield is to provide users with an accessible platform for identifying suspicious job opportunities and reducing the risk of falling victim to online job scams.

The project combines **full-stack web development, cybersecurity concepts, and machine learning** into a single practical application.

---

## 👨‍💻 Developer

**Mayank**

B.Tech Computer Science & Engineering
Sri Sukhmani Institute of Engineering & Technology
I.K. Gujral Punjab Technical University

---

## 📌 Project Status

**Current Status: Development Completed & Tested**

The core JobShield functionality, authentication, ML integration, URL analysis, history, dashboard, security testing, and UI have been implemented and tested.

**Deployment is the next phase.**
