import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Select, MenuItem, FormControl } from "@mui/material";
import { updateUserAddress, updateUserProfile } from "../utils/userSlice";
import { CITIES_IN_KERALA as cities } from "../utils/constants";
import { useSnackbar } from "notistack";

const Profile = () => {
  const {
    role,
    userData: data,
    address,
    loading,
    error,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data && address) {
      setUserData(data);
      setUserAddress(address);
    }
  }, [data]);

  const onProfileChange = (e) => {
    const { name, files, type, value } = e.target;

    if (type === "file") {
      setProfilePicture(files[0]);
      setProfilePreview(URL.createObjectURL(files[0]));
    }
    setUserData((prev) => ({
      ...prev,
      [name]: type === "file" ? null : value.trim(),
    }));
  };

  const handleProfileSave = async () => {
    if (userData.phoneNumber) {
      const validPhone = isValidPhoneNumber(userData.phoneNumber);

      if (!validPhone) {
        enqueueSnackbar("Enter valid Phone Number", { variant: "error" });
        return;
      }
    }

    const formData = new FormData();

    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("profilePicture", profilePicture);

    try {
      const response = await dispatch(
        updateUserProfile({ role, formData })
      ).unwrap();
      enqueueSnackbar("Profile updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Profile not updated", { variant: "error" });
      console.log(error);
    }
  };

  const onAddressChange = (e) => {
    const { name, value } = e.target;

    setUserAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateAddress = async () => {
    try {
      await dispatch(
        updateUserAddress({ role, address: userAddress })
      ).unwrap();

      enqueueSnackbar("Address updated successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update address", { variant: "error" });
      console.error(error);
    }
  };

  if (loading || !userAddress || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error fetching User Profile</p>
      </div>
    );
  }

  return (
    <div className="px-24 py-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col border-[#b3b3b3] border-[1px] rounded-md">
          {/* Profile Section  */}
          <div className="p-4">
            <h2 className="text-xl font-semibold">Account Details</h2>
          </div>

          <div className="bg-[#b3b3b3] w-full h-[1px]" />
          <div className="grid grid-cols-2 items-center justify-center">
            <div className="flex flex-col p-4 gap-3">
              <div className="flex flex-col gap-2">
                <label>First Name</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-4 rounded-md outline-none"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={userData?.firstName || ""}
                  onChange={onProfileChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Last Name</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-4 rounded-md outline-none"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={userData?.lastName || ""}
                  onChange={onProfileChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Phone Number</label>
                <div className="flex items-center border-[#b3b3b3] border-[1px] rounded-md">
                  <span className="px-4 border-r-[1px] border-[#b3b3b3]">
                    +91
                  </span>
                  <input
                    className="p-4 rounded-md flex-1 border-none focus:ring-0 outline-none"
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={userData?.phoneNumber?.replace(/^\+91/, "") || ""}
                    onChange={(e) => {
                      // Allow only numbers and auto-strip +91 if entered manually
                      const numericValue = e.target.value
                        .replace(/\D/g, "")
                        .replace(/^\+91/, "");
                      onProfileChange({
                        target: {
                          name: "phoneNumber",
                          value: `+91${numericValue}`,
                        },
                      });
                    }}
                    maxLength={10} // For Indian phone numbers
                  />
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="cursor-pointer py-3 mt-2 bg-[#00B207] text-white rounded-full font-medium hover:bg-[#2C742F] text-center"
              >
                Save Changes
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : userData?.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_URL}/${
                    userData.profilePicture
                  }`}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="h-32 w-32 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {(userData?.firstName?.[0] || "") +
                      (userData?.lastName?.[0] || "")}{" "}
                  </span>
                </div>
              )}
              <input
                type="file"
                hidden
                id="profile-picture"
                accept="image/*"
                name="profilePicture"
                onChange={onProfileChange}
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer w-[10em] py-3 mt-2 border-[#00B207] border-2 text-[#00B207] rounded-full font-medium text-center hover:bg-[#00B207] hover:border-white hover:text-white"
              >
                Choose Image
              </label>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col border-[#b3b3b3] border-[1px] rounded-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Billing Address</h2>
          </div>
          <div className="bg-[#b3b3b3] w-full h-[1px]" />
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* House Name & City Row */}
              <div className="flex flex-col gap-2">
                <label>House Name</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-3 rounded-md outline-none"
                  type="text"
                  name="houseName"
                  placeholder="House Name"
                  value={userAddress?.houseName || ""}
                  onChange={onAddressChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>City</label>
                <FormControl fullWidth>
                  <Select
                    value={userAddress?.city || ""}
                    onChange={(e) =>
                      setUserAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    displayEmpty
                    inputProps={{
                      name: "city",
                      id: "city-select",
                    }}
                    sx={{
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#b3b3b3",
                      },
                      "& .MuiSelect-select": {
                        padding: "13px",
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select City</em>
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Street & Postal Code Row */}
              <div className="flex flex-col gap-2">
                <label>Street</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-3 rounded-md outline-none"
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={userAddress?.street || ""}
                  onChange={onAddressChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Postal Code</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-3 rounded-md outline-none"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={userAddress?.postalCode || ""}
                  onChange={onAddressChange}
                />
              </div>
            </div>

            <button
              onClick={handleUpdateAddress}
              className="w-full md:w-auto cursor-pointer py-3 mt-2 bg-[#00B207] text-white rounded-full font-medium hover:bg-[#2C742F] text-center px-8"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
