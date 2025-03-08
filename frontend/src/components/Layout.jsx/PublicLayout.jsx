import { Outlet } from "react-router-dom";
import Navbar from "../Public/Navbar";
import Footer from "../Public/Footer";

const PublicRoute = () => {
  return (
    <div>
      {/* Navbar is included in the public layout */}
      <Navbar />
      <div className="container mx-auto mt-4 p-4">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default PublicRoute;
