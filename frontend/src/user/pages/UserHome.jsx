import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserHome = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default UserHome;
