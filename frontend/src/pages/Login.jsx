import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { loginFarmer } from "../auth/authActions";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-phone-number-input/style.css";

const Login = () => {
  const [data, setData] = useState({
    phoneNumber: "",
    password: "",
  });

  const { loading, error, success, userInfo } = useSelector(
    (state) => state.auth
  );

  const formSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone is required")
      .test("is-valid-phone", "Invalid phone number", (value) =>
        isValidPhoneNumber(data.phoneNumber)
      ),
    password: Yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange", resolver: yupResolver(formSchema) });

  watch();

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
            {...register("phoneNumber")}
            value={data.phoneNumber}
            onChange={(value) => {
              setData((prev) => ({ ...prev, phoneNumber: value }));
            }}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-600 mt-1">
              {errors.phoneNumber.message}
            </p>
          )}

          <label htmlFor="password">Password</label>
          <input
            name="password"
            value={data.password}
            className="input-field"
            {...register("password")}
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
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button className="btn-primary" onClick={handleSubmit(onLogin)}>
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
