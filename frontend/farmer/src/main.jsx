import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store from "./store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </Provider>
);
