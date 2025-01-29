import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useSnackbar } from "notistack";
import { registerFarmer } from "../auth/farmerActions";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-phone-number-input/style.css";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string().required("Phone is required"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password length should be at least 4 characters")
      .max(12, "Password cannot exceed more than 12 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(formSchema) });

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
        <div className="flex flex-col p-4 gap-2">
          <div className="flex flex-col">
            <label htmlFor="name">Full Name</label>
            <input
              name="name"
              value={data.name}
              {...register("name", { required: true })}
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
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phoneNumber"> Phone Number</label>
            <PhoneInput
              defaultCountry="IN"
              name="phoneNumber"
              {...register("phoneNumber", { required: true })}
              placeholder="Enter your phone number"
              value={data.phoneNumber}
              className="input-field"
              onChange={(value) => {
                setData((prev) => ({ ...prev, phoneNumber: value }));
              }}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-600 mt-1">Phone is required</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Enter your password</label>
            <input
              name="password"
              {...register("password", { required: true })}
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
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">Password is required</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword">Confirm your password</label>
            <input
              name="confirmPassword"
              {...register("confirmPassword", { required: true })}
              value={data.confirmPassword}
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
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmit(onRegister)}>
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
