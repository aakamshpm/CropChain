import { useState } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from "axios";
import OtpInput from "react-otp-input";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) =>
        value ? isValidPhoneNumber(value) : false
      ),
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .when("showOtpSection", {
        is: true,
        then: (schema) => schema.required("OTP is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const sendOtp = async (values) => {
    const { phoneNumber } = values;
    setLoading(true);
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      enqueueSnackbar("OTP sent to your phone!", { variant: "success" });
      setShowOtpSection(true);
    } catch (err) {
      enqueueSnackbar(err?.message || "OTP sending failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (values) => {
    const { otp } = values;
    setVerifying(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      // Backend request
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { firebaseToken }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin");
      enqueueSnackbar("OTP verified successfully!", { variant: "success" });
      navigate("/");
    } catch (err) {
      enqueueSnackbar("OTP verification failed", { variant: "error" });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = (values) => {
    if (!showOtpSection) {
      sendOtp(values);
    } else {
      verifyOtp(values);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
      }}
    >
      <div className="flex flex-col justify-center p-8 bg-white bg-opacity-90 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          {showOtpSection && (
            <button onClick={() => setShowOtpSection(false)}>
              <ArrowBack className="text-green-700 cursor-pointer" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-green-700 text-center flex-1">
            Admin Login
          </h1>
          <div id="recaptcha-container"></div>
        </div>

        <Formik
          initialValues={{ username: "", phoneNumber: "", otp: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="w-full">
              {!showOtpSection ? (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <PhoneInput
                      defaultCountry="IN"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={values.phoneNumber}
                      onChange={(value) => {
                        setFieldValue("phoneNumber", value);
                      }}
                    />

                    {touched.phoneNumber && errors.phoneNumber && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}{" "}
                    {!loading && <ArrowForward className="ml-2" />}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter OTP
                    </label>
                    <OtpInput
                      value={values.otp}
                      onChange={(otp) => setFieldValue("otp", otp)}
                      numInputs={6}
                      renderSeparator={<span className="mx-1"></span>}
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: "3rem",
                        height: "3rem",
                        fontSize: "1.2rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #D1D5DB",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                        marginTop: "10px",
                      }}
                      focusStyle={{
                        borderColor: "#10B981",
                        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                      }}
                      containerStyle={{
                        justifyContent: "center",
                      }}
                      shouldAutoFocus
                    />

                    {touched.otp && errors.otp && (
                      <p className="text-xs text-red-600 mt-1">{errors.otp}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-400"
                    disabled={verifying}
                  >
                    {verifying ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
