import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user }) => {
  const token = localStorage.getItem("token");
  // Check if user exists and has admin role
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
