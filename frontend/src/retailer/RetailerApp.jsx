import { Outlet } from "react-router-dom";

const RetailerApp = () => {
  return (
    <div className="retailer">
      <Outlet />
    </div>
  );
};

export default RetailerApp;
