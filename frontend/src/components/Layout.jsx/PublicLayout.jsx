import { Outlet } from "react-router-dom";
import Navbar from "../Public/Navbar";
import Footer from "../Public/Footer";

const PublicRoute = () => {
  return (
    <div>
      {/* Navbar is included in the public layout */}
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default PublicRoute;
