import { useState } from "react";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { farmerRegister } from "../api/farmerApi";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const onRegister = async () => {
    try {
      const response = await farmerRegister(data);
      console.log(response);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div>
      <div className="input-fields">
        <input
          name="name"
          value={data.name}
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
      <button onClick={onRegister}>Register</button>
      <div>
        <p>
          Already Registered? <Link to="/login">Login</Link> now!
        </p>
      </div>
    </div>
  );
};

export default Register;
