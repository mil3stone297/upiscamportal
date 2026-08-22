# 🛡️ UPI Scam & Fraud Reporting Portal

A full-stack web application designed to report, track, manage, and analyze UPI (Unified Payments Interface) scam and fraud incidents. The portal empowers victims to document digital financial fraud, view community incident history, and track investigation statuses.

---

## 🌟 Key Features

- **🚨 Incident Reporting**: Log fraud incidents with details including fraudster's UPI ID, transaction reference, amount lost, incident category, and detailed description.
- **🔍 Search & Filter**: Instant search across victim names, UPI IDs, transaction IDs, banks, and filter by status or scam type (e.g., Phishing, Fake Call, Fake QR).
- **📊 Real-time Dashboard**: Comprehensive overview of reported fraud cases with status badges (`Pending`, `Under Review`, `Resolved`, `Rejected`).
- **✏️ Manage Reports**: Edit case details, update resolution statuses, or delete records.
- **📱 Fully Responsive SPA**: Single Page Application (SPA) architecture with smooth navigation and modern UI design.
- **🔌 RESTful API**: Built with Node.js & Express with strict request validation and error handling.

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, Custom Input Validation, Static File Serving
- **Data Management**: In-Memory Store with unique UUID generation

### Frontend
- **Structure**: Vanilla HTML5 (Semantic & Accessible)
- **Styling**: Modern Vanilla CSS (Custom Design System, Glassmorphism, Responsive Grid/Flexbox)
- **Logic**: Vanilla JavaScript (Modular SPA Views & Fetch API Client)

---

## 📁 Project Structure

```text
Upiscamportal/
├── backend/
│   ├── data/
│   │   └── store.js           # In-memory store and initial seed records
│   ├── middleware/
│   │   └── validate.js        # Input validation & sanitization rules
│   ├── routes/
│   │   └── reports.js         # API endpoints for CRUD operations
│   ├── package.json           # Backend package configuration
│   └── server.js              # Express app bootstrap & static file server
├── frontend/
│   ├── css/
│   │   └── style.css          # Core design styles and animations
│   ├── js/
│   │   ├── api.js             # Frontend API client
│   │   ├── app.js             # Router and view controller
│   │   └── views/
│   │       ├── home.js          # Dashboard & report list view
│   │       ├── report-form.js   # Submit & edit form view
│   │       └── report-detail.js # Incident detail view
│   └── index.html             # Single-page entry HTML
├── package.json               # Root scripts
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/mil3stone297/upiscamportal.git
cd upiscamportal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
*Or for development:*
```bash
node backend/server.js
```

### 4. Open in Browser
Visit **[http://localhost:5000](http://localhost:5000)** to access the portal.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/reports` | Retrieve all fraud reports (supports `?search=`, `?type=`, `?status=`) |
| `GET` | `/reports/:id` | Retrieve report details by ID |
| `POST` | `/reports` | Submit a new fraud report |
| `PUT` | `/reports/:id` | Update an existing fraud report |
| `DELETE` | `/reports/:id` | Delete a report by ID |

### Example: Submit a New Report (`POST /api/reports`)

**Header:** `Content-Type: application/json`

**Request Body:**
```json
{
  "reporterName": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "phone": "9876543210",
  "incidentDate": "2026-08-10",
  "upiId": "fraudster@paytm",
  "transactionId": "TXN20260810123456",
  "amountLost": 15000,
  "incidentType": "fake_call",
  "bankName": "HDFC Bank",
  "description": "Received a call from a fake bank agent asking for OTP verification."
}
```

---

## 🛡️ Incident Types & Statuses

- **Incident Types**:
  - `phishing`: Phishing link or fraudulent website
  - `fake_call`: Impersonation or fake bank representative call
  - `unauthorized_transaction`: Direct deduction without user consent
  - `fake_qr`: QR code sticker tampering or payment redirection
  - `other`: Lottery, task scam, or other UPI fraud

- **Report Statuses**:
  - `pending` 🟡
  - `under_review` 🔵
  - `resolved` 🟢
  - `rejected` 🔴

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mil3stone297/upiscamportal/issues).

---

## 📄 License

This project is licensed under the ISC License.
