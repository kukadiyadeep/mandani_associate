# MANDANI ASSOCIATE – Loan & Financial Consultancy (Frontend Prototype)

A React + Tailwind CSS frontend prototype for a loan consultancy website: loan categories,
EMI calculator, loan comparison, eligibility checker, multi-step application form, application
tracking, customer dashboard, and an admin panel — all with in-memory mock data.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's real vs. mocked

- **Real / working:** all UI, EMI math (reducing-balance formula), forms, client-side
  validation, filtering/sorting, charts (Recharts), multi-step application flow, status
  timeline logic.
- **Mocked (no backend yet):** authentication, database storage, document upload/storage,
  SMS/email/WhatsApp notifications. All "submitted" data lives in React state and resets on
  page refresh. Login and the Admin Panel are demo view-switches, not real auth/role checks.

## Suggested next steps for production

1. Add a Node.js/Express (or similar) API with routes for applications, documents, and users.
2. Add PostgreSQL or MongoDB for persistence.
3. Add real authentication (JWT or Firebase Auth) with customer/consultant/admin roles.
4. Store uploaded documents in private cloud storage (S3 or Firebase Storage) — never public URLs.
5. Wire the contact/callback and application forms to your API with React Hook Form + Zod validation.
6. Add SMS/email/WhatsApp providers for the notification events already stubbed in the UI.
