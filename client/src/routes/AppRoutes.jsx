// AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import DonorLogin from "./pages/donor/DonorLogin";
import DonorSignup from "./pages/donor/DonorSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/donor/login" element={<DonorLogin />} />
        <Route path="/donor/signup" element={<DonorSignup />} />

        {/* Protected Routes */}
        <Route
          path="/adminDashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/donorDashboard"
          element={
            <PrivateRoute allowedRole="donor">
              <DonorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
