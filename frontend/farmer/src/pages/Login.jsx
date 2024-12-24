import { useState } from "react";
import { Link } from "react-router-dom";
import { farmerLogin } from "../api/farmerApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSnackbar } from "notistack";

const Login = () => {
  const [data, setData] = useState({
    phoneNumber: "",
    password: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const onLogin = async () => {
    try {
      const response = await farmerLogin(data);
      enqueueSnackbar("Login success", { variant: "success" });
    } catch (err) {
      console.log(err.message);
      enqueueSnackbar(err?.response?.data?.message || err?.message, {
        variant: "error",
      });
    }
  };
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
