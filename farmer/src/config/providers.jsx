import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store from "./store";

const providers = ({ children }) => {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        {children}
      </SnackbarProvider>
    </Provider>
  );
};

export default providers;
