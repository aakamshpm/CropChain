import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

export default App;
