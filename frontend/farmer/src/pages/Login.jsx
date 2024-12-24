import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { loginFarmer } from "../auth/authActions";
import "react-phone-number-input/style.css";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [data, setData] = useState({
    phoneNumber: "",
    password: "",
  });

  const { loading, error, success, userInfo } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const onLogin = () => {
    dispatch(loginFarmer(data));
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Login success", { variant: "success" });
      navigate("/");
    }

    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  }, [success, error, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-8 border-[1px] border-black rounded-lg">
        <h1 className="text-primary-color font-semibold text-2xl mb-4">
          Farmer Login
        </h1>
        <div className="flex flex-col p-2">
          <label htmlFor="phoneNumber"> Phone Number</label>
          <PhoneInput
            defaultCountry="IN"
            name="phoneNumber"
            className="input-field"
            placeholder="Enter your phone number"
            value={data.phoneNumber}
            onChange={(value) => {
              setData((prev) => ({ ...prev, phoneNumber: value }));
            }}
          />
          <label htmlFor="password">Password</label>

          <input
            name="password"
            value={data.password}
            className="input-field"
            onChange={(e) =>
              setData((prev) => {
                return {
                  ...prev,
                  [e.target.name]: e.target.value,
                };
              })
            }
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button className="btn-primary" onClick={onLogin}>
          Login
        </button>
        <p className="mt-3">
          New to CropChain?{" "}
          <Link className="underline" to="/register">
            Register
          </Link>{" "}
          now!
        </p>
      </div>
    </div>
  );
};

export default Login;
