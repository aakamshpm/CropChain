import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  // const location = useLocation();

  // const excludedRoutes = ["/login", "/register"];

  // const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <div className="user flex flex-col font-['Poppins']">
      {/* {!isExcludedRoute && <Navbar />} */}
      <Navbar />
      <Outlet />
      <Footer />
      {/* {!isExcludedRoute && <Footer />} */}
    </div>
  );
};

export default App;
