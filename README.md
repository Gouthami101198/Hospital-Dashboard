# Vitalis — Hospital Management Dashboard

A modern, responsive Hospital Management Dashboard built with React, Tailwind CSS, and Recharts.

## Folder structure

```
hospital-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx                # Root shell: routing state, protected routes
    ├── index.css              # Tailwind + global styles
    ├── context/
    │   ├── ThemeContext.jsx   # Light/dark mode
    │   └── ToastContext.jsx   # Toast notifications
    ├── data/
    │   ├── seedData.js        # Mock data generators
    │   └── useVitalisDB.js    # useReducer-based in-memory "store"
    ├── utils/
    │   ├── helpers.js         # cx, uid, formatters, regex validators
    │   └── constants.js       # Departments, wards, status color maps
    ├── components/
    │   ├── common/            # Reusable atoms: Button, Modal, Field, Pagination...
    │   ├── layout/             # Sidebar, Topbar
    │   └── resource/
    │       └── ResourceManager.jsx  # Generic CRUD table (search/sort/filter/paginate/modal)
    └── pages/
        ├── auth/               # Login, Forgot Password, Reset Password
        ├── DashboardOverview.jsx
        ├── PatientManagement.jsx
        ├── DoctorManagement.jsx
        ├── AppointmentManagement.jsx
        ├── BedManagement.jsx
        ├── PharmacyPage.jsx
        ├── BillingPage.jsx
        ├── NotificationsPage.jsx
        └── ProfilePage.jsx
```

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Demo login

The email and password fields on the login screen are pre-filled with working
demo credentials — just click **Sign in**. This app has no real backend; all
data lives in memory (via `useReducer`) and resets on page reload.

## Notes

- State management: React Context (theme, toasts) + `useReducer` (domain data),
  as an alternative to Redux Toolkit.
- Routing: view-state based (`page` in `App.jsx`) rather than `react-router-dom`,
  since this project is designed to also drop into single-file environments.
  Swapping in `react-router-dom` would mean turning each `pages/*` entry into
  a route and replacing `goTo()` calls with `navigate()`.
- Charts: Recharts (`AreaChart`, `BarChart`, `PieChart`).
- Icons: lucide-react.
