import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me");
        const role = res.data.role;
        if (role === "admin") navigate("/adminDashboard");
        else if (role === "donor") navigate("/donorDashboard");
        else navigate("/needyDashboard");
      } catch {
        navigate("/select-role");
      }
    })();
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>Signing you in...</p>;
};

export default OAuthSuccess;
