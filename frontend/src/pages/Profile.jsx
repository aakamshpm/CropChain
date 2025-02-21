import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isValidPhoneNumber } from "react-phone-number-input";
import { fetchUserProfile, updateUserProfile } from "../utils/userSlice";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { role, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      if (role) {
        try {
          const response = await dispatch(fetchUserProfile({ role })).unwrap();
          setUserData(response);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [role, dispatch]);

  const onChangeHandler = (e) => {
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
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
      <div className="flex flex-col">
        <div className="flex flex-col border-[#b3b3b3] border-[1px] rounded-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Account Details</h2>
          </div>

          <div className="bg-[#b3b3b3] w-full h-[1px]" />
          <div className="grid grid-cols-2 items-center justify-center">
            <div className="flex flex-col p-4 gap-3">
              <div className="flex flex-col gap-2">
                <label>First Name</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-4 rounded-md"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={userData?.firstName || ""}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Last Name</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-4 rounded-md"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={userData?.lastName || ""}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Phone Number</label>
                <input
                  className="border-[#b3b3b3] border-[1px] p-4 rounded-md"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={userData?.phoneNumber || ""}
                  onChange={onChangeHandler}
                />
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
                onChange={onChangeHandler}
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
      </div>
    </div>
  );
};

export default Profile;
