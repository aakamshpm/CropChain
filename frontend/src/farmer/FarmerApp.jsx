import { Outlet } from "react-router-dom";

const FarmerApp = () => {
  return (
    <div className="farmer">
      <Outlet />
    </div>
  );
};

export default FarmerApp;
