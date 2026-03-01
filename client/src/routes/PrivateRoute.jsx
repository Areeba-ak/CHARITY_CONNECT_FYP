// routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== allowedRole) {
    // redirect to corresponding login
    if (allowedRole === "donor") return <Navigate to="/donor/login" />;
    if (allowedRole === "needy") return <Navigate to="/needy/login" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
