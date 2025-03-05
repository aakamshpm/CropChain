import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { SnackbarProvider } from "notistack";
import VerifyFarmers from "./pages/VerifyFarmers.jsx";
import FarmerDetails from "./pages/FarmerDetails.jsx";
import ViewFarmers from "./pages/ViewFarmers.jsx";
import ViewConsumers from "./pages/ViewConsumers.jsx";
import ViewRetailers from "./pages/ViewRetailers.jsx";
import ViewAllOrders from "./pages/ViewAllOrders.jsx";
import ViewOrdersToDeliver from "./pages/ViewOrdersToDeliver.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route element={<PrivateRoutes />}>
          <Route index element={<Home />} />
          <Route path="/verify-farmers" element={<VerifyFarmers />} />
          <Route path="/verify-farmers/:farmerId" element={<FarmerDetails />} />
          <Route path="/view-farmers" element={<ViewFarmers />} />
          <Route path="/consumers" element={<ViewConsumers />} />
          <Route path="/retailers" element={<ViewRetailers />} />
          <Route path="/orders" element={<ViewAllOrders />} />
          <Route path="/orders-to-deliver" element={<ViewOrdersToDeliver />} />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </StrictMode>
);
