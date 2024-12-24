import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { useSnackbar } from "notistack";
import { registerFarmer } from "../auth/authActions";
import "react-phone-number-input/style.css";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const { loading, error, success, userInfo } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const onRegister = () => {
    dispatch(registerFarmer(data));
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Register success", { variant: "success" });
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
          Farmer Register
        </h1>
        <div className="flex flex-col p-2">
          <label htmlFor="name">Full Name</label>
          <input
            name="name"
            value={data.name}
            className="input-field"
            onChange={(e) =>
              setData((prev) => {
                return {
                  ...prev,
                  [e.target.name]: e.target.value,
                };
              })
            }
            type="text"
            placeholder="Enter your Full Name"
          />
          <label htmlFor="phoneNumber"> Phone Number</label>
          <PhoneInput
            defaultCountry="IN"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={data.phoneNumber}
            className="input-field"
            onChange={(value) => {
              setData((prev) => ({ ...prev, phoneNumber: value }));
            }}
          />
          <label htmlFor="password">Enter your password</label>
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
        <button className="btn-primary" onClick={onRegister}>
          Register
        </button>
        <p className="mt-3">
          Already Registered?
          <Link className="underline" to="/login">
            Login
          </Link>{" "}
          now!
        </p>
      </div>
    </div>
  );
};

export default Register;
