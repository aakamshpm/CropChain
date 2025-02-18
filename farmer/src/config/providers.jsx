import { Provider } from "react-redux";
import store from "./store";

const providers = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default providers;
