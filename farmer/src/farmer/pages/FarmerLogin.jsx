import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { loginFarmer } from "../auth/farmerActions";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import { FiSmartphone, FiLock } from "react-icons/fi";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone is required")
      .test("is-valid-phone", "Invalid phone number", (value) =>
        isValidPhoneNumber(value)
      ),
    password: Yup.string().required("Password is required"),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      await dispatch(loginFarmer(values)).unwrap();
      enqueueSnackbar("Login success", { variant: "success" });
      navigate("/");
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Sign in to your CropChain account</p>
        </div>

        <Formik
          initialValues={{ phoneNumber: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiSmartphone className="w-5 h-5" />
                    </span>
                    <PhoneInput
                      defaultCountry="IN"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      placeholder="Enter phone number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(value) => setFieldValue("phoneNumber", value)}
                    />
                  </div>
                  <ErrorMessage name="phoneNumber">
                    {(msg) => (
                      <p className="text-red-500 text-sm mt-1">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiLock className="w-5 h-5" />
                    </span>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                  <ErrorMessage name="password">
                    {(msg) => (
                      <p className="text-red-500 text-sm mt-1">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create account
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
