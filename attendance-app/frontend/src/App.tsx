import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AdminDashboardPage from "./routes/AdminDashboardPage";
import EmployeeHomePage from "./routes/EmployeeHomePage";
import LoginPage from "./routes/LoginPage";
import { useAuthStore } from "./features/auth/store";
import type { UserRole } from "./features/auth/types";

const RequireAuth = ({ requiredRole }: { requiredRole?: UserRole }) => {
  const location = useLocation();
  const { token, role } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth requiredRole="employee" />}>
        <Route path="/employee" element={<EmployeeHomePage />} />
      </Route>
      <Route element={<RequireAuth requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
