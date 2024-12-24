import { useState } from "react";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { useSnackbar } from "notistack";
import { farmerRegister } from "../api/farmerApi";
import "react-phone-number-input/style.css";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const onRegister = async () => {
    try {
      const response = await farmerRegister(data);
      enqueueSnackbar("Register success", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err?.message, {
        variant: "error",
      });
    }
  };

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
