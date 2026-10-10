# Lex System

**Lex System** is an Enterprise-Grade, Multi-Tenant SaaS platform designed specifically for law firms. Built with an unwavering commitment to security, scalability, and premium user experience, Lex System provides a highly customizable "White-Label" architecture, allowing independent law practices to operate under their own domains while sharing a robust, unified backend.

---

## 🎯 Objectives

The legal industry handles the most sensitive data imaginable, yet frequently relies on fragmented, outdated software. Lex System was built to solve this by providing:
1. **Uncompromising Security (LGPD/GDPR):** Military-grade encryption for Personally Identifiable Information (PII) before it ever reaches the database.
2. **Multi-Tenant White-Labeling:** A single, easily maintainable codebase that dynamically adapts its branding, typography, and color harmony based on the accessing tenant's domain.
3. **Premium User Experience:** Replacing abrupt native browser interactions with graceful skeleton loaders, custom polymorphic modals, and a built-in haptic feedback engine for tactile responsiveness.

---

## 🏗️ System Architecture

Lex System leverages a modern, event-driven microservices approach to ensure maximum compliance and portability.

### The Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS.
* **Backend Integration:** Supabase (Managed PostgreSQL) with `@supabase/ssr` for secure server-side session management.
* **Authentication:** Next.js Server Actions interacting with Supabase Auth, protected by strict Route Middleware.
* **Cryptography:** Node.js native `crypto` library utilizing `AES-256-CBC`.

### The B.L.A.S.T. Doctrine
Lex System is developed under a strict internal framework known as the B.L.A.S.T Doctrine:
1. **Determinism over Guessing:** Business logic must always be predictable.
2. **Security by Design:** Assume the network is hostile. Implement automated self-pentesting and threat modeling.
3. **Continuous Self-Audit:** Rigorous performance and UX checks.
4. **Documentation as Infrastructure:** Architecture must be self-documenting.
5. **Modular SaaS Architecture:** All components must be portable and strictly isolated per tenant via ORM Row-Level Security (RLS).

---

## 🚀 Features & Modules Developed

### 1. The White-Label Engine
A dynamic routing middleware intercepts the incoming `host` header. It mathematically calculates harmonious color palettes (Primary, Secondary, Surface, Accent) using HSL color wheel logic, injecting custom branding seamlessly into the React application without requiring separate deployments.

### 2. Master Landing Page
A highly polished, dark-themed corporate portal featuring:
- Asynchronous data fetching with Skeleton Loaders.
- Abstract masonry layouts for "Practice Areas".
- Dynamic "Attorney Profiles" and "Testimonials" injected via the Tenant Configuration.
- Cal.com-inspired interactive scheduling modal.

### 3. PII Vault (Client Registry)
A highly secure CRM interface for lawyers.
- **AES-256 Encryption at Rest:** Sensitive client data (CPF, RG) is intercepted by Server Actions and encrypted locally on the server before being sent to the database.
- **Data Scrubbing UI:** Client identifiers are automatically masked (`***.458.992-**`) to protect against over-the-shoulder privacy breaches.

### 4. Process Tracker Dashboard
An internal, secure dashboard (`/dashboard`) for firm operations.
- Locked behind strict Supabase SSR Auth middleware.
- Interactive data tables tracking ongoing litigation and PJe (Electronic Judicial Process) statuses.
- Dedicated sidebar navigation with active path tracking.

---

## 🔒 Security Implementations
- **No Native Alerts:** `alert()` and `confirm()` are strictly forbidden to prevent main-thread blocking and UI inconsistencies.
- **Haptic Engine:** Simulated tactile feedback built into interaction points to guide user behavior naturally.
- **Server-Side Cookies:** JWT tokens are managed strictly on the server-side via Next.js Middleware and Server Actions, mitigating XSS risks associated with LocalStorage.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project (URL and Anon Key)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/onicafe/Lex-System.git
   ```

2. Install dependencies:
   ```bash
   cd ui
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file inside the `ui` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   PII_VAULT_KEY=your-secure-32-byte-encryption-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3002` depending on your Next.js config) to view the application.

---
*Lex System - Developed by onicafe*
