import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { useVitalisDB } from "./data/useVitalisDB.js";
import { cx } from "./utils/helpers.js";

import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import Spinner from "./components/common/Spinner.jsx";

import AuthShell from "./pages/auth/AuthShell.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";

import DashboardOverview from "./pages/DashboardOverview.jsx";
import PatientManagement from "./pages/PatientManagement.jsx";
import DoctorManagement from "./pages/DoctorManagement.jsx";
import AppointmentManagement from "./pages/AppointmentManagement.jsx";
import BedManagement from "./pages/BedManagement.jsx";
import PharmacyPage from "./pages/PharmacyPage.jsx";
import BillingPage from "./pages/BillingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function AppShell() {
  const t = useTheme();
  const { state: db, dispatch } = useVitalisDB();
  const [authed, setAuthed] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [user, setUser] = useState({
    name: "Dr. Gouthami C",
    email: "gouthami.c@vitalis.org",
    role: "Chief Administrator",
    phone: "+1 555-0199",
  });

  const goTo = (p) => {
    if (p === page) return;
    setPageLoading(true);
    setPage(p);
    setTimeout(() => setPageLoading(false), 300);
  };

  const unread = db.notifications.filter((n) => !n.read).length;

  if (!authed) {
    return (
      <AuthShell>
        {authView === "login" && (
          <LoginPage goTo={setAuthView} onLogin={(email) => { setUser((u) => ({ ...u, email })); setAuthed(true); }} />
        )}
        {authView === "forgot" && <ForgotPasswordPage goTo={setAuthView} />}
        {authView === "reset" && <ResetPasswordPage goTo={setAuthView} />}
      </AuthShell>
    );
  }

  const pages = {
    dashboard: <DashboardOverview db={db} goTo={goTo} />,
    patients: <PatientManagement db={db} dispatch={dispatch} />,
    doctors: <DoctorManagement db={db} dispatch={dispatch} />,
    appointments: <AppointmentManagement db={db} dispatch={dispatch} />,
    beds: <BedManagement db={db} dispatch={dispatch} />,
    pharmacy: <PharmacyPage db={db} dispatch={dispatch} />,
    billing: <BillingPage db={db} dispatch={dispatch} />,
    notifications: <NotificationsPage db={db} dispatch={dispatch} />,
    profile: <ProfilePage user={user} setUser={setUser} />,
  };

  return (
    <div className={cx("min-h-screen font-body flex", t.page)}>
      <Sidebar
        page={page} goTo={goTo} open={sidebarOpen} setOpen={setSidebarOpen} unread={unread}
        onLogout={() => { setAuthed(false); setAuthView("login"); setPage("dashboard"); }}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar setOpen={setSidebarOpen} user={user} unread={unread} goTo={goTo} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {pageLoading ? <Spinner label="Loading" /> : <div className="animate-in">{pages[page]}</div>}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </ThemeProvider>
  );
}
