# Prarthana Bhandari - Full-Stack Developer Portfolio

Welcome to the codebase of my personal portfolio. This is a premium, full-stack web application designed to showcase my skills, professional experiences, certifications, achievements, and GitHub repositories in an interactive, responsive interface.

The application features a modern frontend with dual theme styles (Professional & Creative), backed by a Node.js/Express.js API server and a PostgreSQL database.

---

## 🚀 Key Features

* **Dual Display Themes**:
  * **Professional Mode**: Clean, grid-based, minimalist style tailored for recruitment and enterprise evaluation.
  * **Creative Mode**: Rich gradient colors, floaty abstract blobs, micro-animations, and interactive tech chips for a playful experience.
* **Dynamic Projects Catalog**: Sourced dynamically from a database seeded with **21 GitHub repositories**, complete with descriptions, tags, dates, and code links.
* **Interactive Timeline**: Responsive experience board displaying internships (MERN Stack & Backend roles) with timelines and details.
* **Credential Vault**: Centralized showcase for verified certifications (Udemy, Oracle, LinkedIn, Nasscom).
* **Robust Contact System**: Secure connection form that stores incoming messages in the database and lists them on the admin console.
* **Protected Admin Dashboard**:
  * Secure credential-based login (bcrypt-hashed passwords & JWT sessions).
  * Panel to manage (Add/Edit/Delete/Toggle Featured) projects, experience, skills, and certifications.
  * Settings manager to update social links and hero copy dynamically.
* **Responsive Layout**: Customized layout structures adapting flawlessly across desktop, tablet, and mobile viewports.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Core**: React (v19), Vite (v8)
* **Routing**: React Router DOM (v7)
* **Styling & Theme**: Tailwind CSS (v4), Vanilla CSS
* **Animations**: Framer Motion (v12) for smooth section entries, hover lifts, and modal animations
* **Icons**: React Icons (Fi, Fa, Md), Iconify (for clean logo rendering)
* **Client Request**: Axios (configured with interceptors)

### Backend (Server)
* **Runtime**: Node.js
* **Framework**: Express.js (v5)
* **Database Driver**: pg (node-postgres pool manager)
* **Security & Auth**: jsonwebtoken (JWT) for session control, bcryptjs for password encryption
* **File Uploads**: Multer (configured with mime-type filters to accept PDFs, DOCX, and images)

### Database
* **PostgreSQL**: Relational database storing credentials, projects, site settings, experiences, certificates, and user messages.

---

## 📂 Project Architecture

```
prarthana-portfolio/
├── backend/                  # Node.js Express Server
│   ├── config/               # Database pool and Multer setup
│   ├── controllers/          # Business logic handlers (Auth, Projects, Skills)
│   ├── db/                   # Database schema definitions (schema.sql)
│   ├── middleware/           # JWT verification and upload validators
│   ├── routes/               # API endpoints (/api/projects, /api/settings)
│   ├── uploads/              # Stored uploaded files (PDF certificates, images)
│   ├── initDb.js             # Database table initialization script
│   └── server.js             # Main server entrypoint
│
└── frontend/                 # Vite + React Client SPA
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Profile photos and images
    │   ├── components/       # Reusable components (Navbar, Footer, Admin panels)
    │   │   ├── admin/        # Dashboard layout, Social fields, messages
    │   │   └── sections/     # Hero, About, Projects, Experience, Certificates
    │   ├── context/          # Global state (Theme & Auth context)
    │   ├── hooks/            # Custom hooks (e.g. useWindowSize)
    │   ├── pages/            # Page layouts (Home, Dashboard, ProjectsPage)
    │   ├── services/         # Axios base client
    │   ├── utils/            # Shared helper algorithms and animations
    │   ├── main.jsx          # React renderer
    │   └── index.css         # Styling directives and global designs
```

---

## ⚙️ Installation & Database Setup

Follow these steps to set up the project locally:

### Prerequisites
* **Node.js** (v18+ recommended)
* **PostgreSQL** (running locally on port `5432`)

### 1. Database Initialization
1. Create a PostgreSQL database named `prarthana_portfolio`.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Run the database seed script to build the tables and load the initial data:
   ```bash
   node initDb.js
   ```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` directory with the following keys:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prarthana_portfolio
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Run the Backend Server
Install dependencies and run the dev server:
```bash
npm install
npm run dev
```
The API server will listen on `http://localhost:5000`.

### 4. Run the Frontend Client
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
The client website will load on `http://localhost:5173` or `http://localhost:5174`.

---

## 🔐 Credentials & Management

* **Admin Login**:
  * Access: Navigate to the `/login` route on your frontend.
  * Default Username: `admin`
  * Default Password: `admin123` *(Note: Encrypted inside the PG database using bcryptjs)*
* **Asset Uploads**: Certificates (PDFs/Images) and internship offer letters are parsed and stored in the backend `/uploads` folder, and served dynamically.

---

## 📄 License
This project is self-published for personal portfolio representation. All rights reserved.
