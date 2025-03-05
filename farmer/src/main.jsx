import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Providers from "./config/providers.jsx";
import { router } from "./config/router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </Providers>
  </React.StrictMode>
);
