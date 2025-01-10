import { Outlet } from "react-router-dom";
import { isUserAuthenticated } from "../../utils/userAuth";

const PublicRoute = () => {
  return isUserAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
