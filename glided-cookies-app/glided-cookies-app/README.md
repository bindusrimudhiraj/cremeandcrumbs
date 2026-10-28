# 🍪 Crème & Crumbs — Full-Stack Artisan Bakery App

An artisan bakery e-commerce app built with **React + Vite** (frontend) and **Node.js + Express** (backend). **100% SQL Database Free — No MySQL or external database required!**

---

## 📁 Project Structure

```
glided-cookies-app/
├── backend/    ← Express REST API (port 5000)
│   ├── config/       ← JSON file-based database engine (db.js), createAdmin.js
│   ├── data/         ← Auto-generated db.json database file
│   ├── middleware/   ← JWT Auth & Admin guards
│   ├── routes/       ← Products, Auth, Cart, Wishlist, Orders
│   └── server.js     ← Express server entrypoint & health probe
└── frontend/   ← React + Vite app (port 5173)
    ├── src/
    │   ├── components/  ← Navbar, Footer, ProductCard, Notification
    │   ├── context/     ← AuthContext, StoreContext
    │   ├── pages/       ← Home, Shop, Cookies, Cart (with Address), Account, Admin
    │   └── services/    ← storage.js (localStorage database & order placement)
    └── index.html
```

---

## 🚀 How to Run the Project

The project is completely self-contained with **zero database setup** required.

### Option 1: Standalone Frontend (Fastest)
The frontend contains its own built-in client database (`storage.js`):

1. Open PowerShell or Terminal and go to the frontend directory:
   ```bash
   cd glided-cookies-app/glided-cookies-app/frontend
   ```
2. Start the Vite development server:
   ```cmd
   cmd /c "npm run dev"
   ```
3. Open your browser at:
   👉 **http://localhost:5173**

---

### Option 2: Full-Stack Mode (Backend REST API + Frontend)

#### Step 1 — Start the Backend (Zero SQL Setup Needed)
The backend now uses an embedded JSON file database (`data/db.json`) pre-populated with artisan cookies, brownies, and admin credentials. No MySQL server or configuration is needed!

1. Open a terminal and go to the backend directory:
   ```bash
   cd glided-cookies-app/glided-cookies-app/backend
   ```
2. Start the backend:
   ```cmd
   cmd /c "npm run dev"
   ```
   ✅ API runs at **http://localhost:5000** (Health check: `http://localhost:5000/api/health`)

#### Step 2 — Start the Frontend
In a separate terminal window:
```bash
cd glided-cookies-app/glided-cookies-app/frontend
cmd /c "npm run dev"
```
✅ Web app runs at **http://localhost:5173**

---

### Option 3: Docker Mode
Run the entire stack with a single command:
```bash
docker compose up --build
```
- Frontend: **http://localhost:80**
- Backend: **http://localhost:5000**

---

## 📦 Placing an Order with Delivery Address
When an item is added to the cart, navigating to `/cart` provides:
1. **Cart items overview** with quantity increment, decrement, and removal.
2. **Delivery Address Form**:
   - Flat / House No. / Street Address *(Mandatory)*
   - City *(Mandatory)*
   - State
   - PIN / Postal Code *(Mandatory)*
   - Contact Phone Number *(Optional)*
   - Special Delivery Instructions *(Optional)*
3. **Validation & Confirmation**:
   - Validates that mandatory address details are provided before order placement.
   - Saves address in the order record.
   - Shows confirmed address on the order success screen.
   - Displays delivery destination under **My Orders** (`/account`) and in the **Admin Orders Dashboard** (`/admin/orders`).

---

## 🔑 Default Credentials

| Role     | Email                        | Password  | Access |
|----------|------------------------------|-----------|--------|
| Admin    | admin@cremencrumbs.com      | admin@123 | Full access to Admin Panel (`/admin`) |
| Customer | Register at `/register`      | Any (6+ chars) | Cart, Wishlist, Order Placement, Account |

---

## 🛠️ DevOps Technologies & Tools Used in this Project

Here is the breakdown of DevOps concepts, tools, and practices present in this codebase:

### 1. **Docker & Multi-Stage Containerization**
- Lightweight, reproducible production containers.
- The frontend uses a multi-stage Docker build: Stage 1 compiles React JSX into static assets using Vite; Stage 2 serves the assets via high-performance Nginx Alpine.
- The backend runs a minimal Node.js Alpine container with persisted volume data.

### 2. **Docker Compose Orchestration**
- Defines multi-container networking, port forwardings (80 for frontend, 5000 for backend), and isolated named volumes (`backend_data`) in `docker-compose.yml`.

### 3. **Nginx Reverse Proxy & Web Server**
- Configured in `frontend/nginx.conf` to serve the Single Page Application (SPA) with fallback routing (`try_files $uri $uri/ /index.html`) and transparently route `/api/` traffic to the backend service.

### 4. **GitHub Actions CI/CD Pipeline**
- Located in `.github/workflows/ci.yml`. Automatically checks code formatting, installs locked dependencies, tests backend syntax, and verifies production compilation on git push and pull request.

### 5. **Vite & Rollup Build Automation**
- Compiles, bundles, minifies, and versions assets with automatic tree-shaking and dead-code elimination into `frontend/dist/`.

### 6. **12-Factor App Environment Configuration**
- Uses `dotenv` to isolate environment-specific variables (`PORT`, `JWT_SECRET`, `FRONTEND_URL`) from application logic.

### 7. **DevOps Health Check Probes (`/api/health`)**
- Dedicated endpoint in `backend/server.js` returning `{ status: 'ok', time: '...' }`, built for Kubernetes liveness/readiness probes, Docker health checks, and AWS ALB health monitors.
