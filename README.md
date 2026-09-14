# 🛒 Barakah POS — Point of Sale & Retail Management System

![Barakah POS Banner](https://img.shields.io/badge/Barakah-POS_v1.0.0-emerald?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38BDF8?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Barakah POS** is a modern, high-performance, web-based Point of Sale (POS) and Retail Inventory Management application designed for retail stores, supermarkets, grocery shops, and small-to-medium businesses.

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Supabase**, Barakah POS offers an intuitive cashier terminal, real-time inventory management, Goods Received Notes (GRN), expense tracking, interactive sales analytics, instant PDF receipt generation, and dual-role access control (Admin & Cashier).

---

## ✨ Key Features

### 🛒 1. Billing Desk & Cashier Terminal
* **Fast Item Search & Barcode Lookup**: Instantly filter products by name, category, SKU, or scan barcode.
* **Flexible Cart & Quantity Adjustments**: Adjust quantities, apply itemized discounts, or calculate custom line item pricing on the fly.
* **Payment Methods**: Support for Cash, Credit/Debit Card, UPI / QR payments, and customer credit.
* **Pause & Resume Bills (Hold Bills)**: Hold active customer carts during rush hours and retrieve them at any time without losing items.
* **Instant PDF Receipts**: Generate, preview, download, and print formatted invoices using `jsPDF` & `jsPDF-AutoTable`.

### 📦 2. Stock & Inventory Control
* **Real-time Inventory Tracking**: Automatic stock deduction upon sales completion.
* **Low Stock Alerts**: Visual notifications for items reaching low threshold limits.
* **Stock Movements Log**: Complete audit log for stock adjustments, sales, and inbound shipments.
* **Non-Stock & Tracked Items**: Support for both physical inventory items and services/freshly prepared items.

### 📝 3. Goods Received Notes (GRN)
* **Supplier Stock Inflow**: Create and log Goods Received Notes when receiving new inventory stock.
* **Batch Updates**: Automatically update product stock quantities and unit costs upon approving GRN entries.

### 💸 4. Expense Management
* **Operational Expense Logging**: Record daily store expenses (Rent, Utilities, Salaries, Supplies, Maintenance).
* **Net Profit Calculation**: Automatically factor expenses into profitability metrics.

### 📊 5. Dashboard & Analytics
* **Visual Data Charts**: Powered by `Recharts` for sales trends, top-selling items, revenue vs cost analysis, and category distribution.
* **Custom Date Filtering**: Analyze sales performance across today, 7 days, 30 days, or custom date ranges.

### 🔐 6. Dual Role Access Control
* **Admin Role**: Unrestricted access to Dashboard Analytics, Product CRUD, Stock Movements, GRN, Expense Logs, User Management, and System Settings.
* **Cashier Role**: Clean, distraction-free terminal tailored strictly for fast POS checkout, stock lookup, and hold bill management.

### ☁️ 7. Supabase Cloud Sync with Offline Fallback
* **Cloud Database**: Integrated with **Supabase** (PostgreSQL) for persistence across multiple devices.
* **Local Offline Fallback**: If Supabase environment variables are missing, the system seamlessly transitions into a fully functional local demo mode with pre-seeded data.

---

## 🔑 Demo Credentials

To test the application immediately in local/demo mode, use these pre-configured user credentials:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access (Dashboard, Products, Users, Reports, Expenses, GRN) |
| **Cashier** | `john` | `john123` | Billing Desk, Held Bills, Stock View |
| **Cashier** | `sara` | `sara123` | Billing Desk, Held Bills, Stock View |

---

## 🛠️ Tech Stack

* **Frontend Library**: [React 18](https://react.dev/)
* **Build Tool & Dev Server**: [Vite 5](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) & Custom CSS Design Tokens
* **Database & Cloud**: [Supabase JS Client](https://supabase.com/) (`@supabase/supabase-js`)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Analytics & Charts**: [Recharts](https://recharts.org/)
* **PDF Invoice Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

---

## 📁 Project Structure

```text
Barakah-Pos/
├── barakah-pos.jsx          # Main application container & router switcher
├── index.html               # HTML entry point
├── package.json             # NPM dependencies and build scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS theme configuration
├── vite.config.js           # Vite server & build configuration
├── .env.example             # Environment variable template
└── src/
    ├── components/
    │   ├── admin/           # Admin Dashboard, Products, Stock, Reports, Users, GRN
    │   ├── auth/            # Intro, Role Selection, Login Screens
    │   ├── cashier/         # Cashier Shell, Stock Lookup, Cashier Held Bills
    │   ├── modals/          # App Modals (Checkout, Add Product, Hold Bill, etc.)
    │   ├── pos/             # POS Billing Desk & Terminal
    │   ├── shared/          # Shared views (Profile, Expense Tracking)
    │   └── ui/              # UI design system tokens & styled primitives
    ├── data/
    │   └── seedData.js      # Mock seed data for offline / demo mode
    ├── lib/
    │   └── supabase.js      # Supabase client setup
    ├── services/
    │   └── supabaseService.js # Database CRUD service layer
    └── utils/
        └── helpers.js       # Date, currency, and stock calculation utilities
```

---

## 🚀 Getting Started

Follow these steps to set up and run Barakah POS locally:

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Barakah-Pos.git
cd Barakah-Pos
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables (Optional for Supabase Cloud Sync)
Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> 💡 *If `.env` is omitted or left empty, Barakah POS will run in **Demo Mode** using mock seed data in local state.*

### 5. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```
The compiled production bundle will be generated in the `dist/` directory.

---

## 🗄️ Supabase Database Schema Setup (SQL)

If you are using **Supabase** cloud database sync, execute the following SQL script in your Supabase **SQL Editor** to create the required tables:

```sql
-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  category TEXT,
  price NUMERIC DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  stock NUMERIC DEFAULT 0,
  low_stock_threshold NUMERIC DEFAULT 5,
  unit TEXT DEFAULT 'piece',
  inventory_type TEXT DEFAULT 'STOCK_TRACKED',
  status TEXT DEFAULT 'Active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'CASHIER',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  cashier_id TEXT,
  cashier_name TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  cash_received NUMERIC DEFAULT 0,
  change NUMERIC DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Goods Received Notes (GRN) Table
CREATE TABLE IF NOT EXISTS grns (
  id TEXT PRIMARY KEY,
  grn_number TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  received_date DATE DEFAULT CURRENT_DATE,
  items JSONB NOT NULL,
  total_amount NUMERIC DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'Approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create Held Bills Table
CREATE TABLE IF NOT EXISTS held_bills (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  cashier_id TEXT,
  cashier_name TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  held_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Create Stock Movements Log Table
CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  movement_type TEXT NOT NULL, -- e.g., 'SALE', 'GRN', 'ADJUSTMENT'
  quantity_changed NUMERIC NOT NULL,
  previous_stock NUMERIC NOT NULL,
  new_stock NUMERIC NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.
