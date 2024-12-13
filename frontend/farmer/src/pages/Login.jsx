import { useState } from "react";
import { Link } from "react-router-dom";
import { farmerLogin } from "../api/farmerApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Login = () => {
  const [data, setData] = useState({
    phoneNumber: "",
    password: "",
  });

  const onLogin = async () => {
    try {
      const response = await farmerLogin(data);
      console.log(response);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  return (
    <div>
      <div className="input-fields">
        <PhoneInput
          defaultCountry="IN"
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={data.phoneNumber}
          onChange={(value) => {
            setData((prev) => ({ ...prev, phoneNumber: value }));
          }}
        />
        <input
          name="password"
          value={data.password}
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
      <button onClick={onLogin}>Login</button>
      <div>
        <p>
          New to CropChain? <Link to="/register">Register</Link> now!
        </p>
      </div>
    </div>
  );
};

export default Login;
