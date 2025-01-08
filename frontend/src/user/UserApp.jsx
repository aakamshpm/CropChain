import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const UserApp = () => {
  return (
    <div className="user">
      <Outlet />
    </div>
  );
};

export default UserApp;
