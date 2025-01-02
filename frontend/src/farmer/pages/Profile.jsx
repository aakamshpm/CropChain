import { useEffect, useRef, useState } from "react";
import { useGetFarmerDetailsQuery } from "../auth/authService";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import InputField from "../components/InputField";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { updateFarmerData, uploadProfilePhoto } from "../auth/authActions";

const Profile = () => {
  const { data: response, isLoading, refetch } = useGetFarmerDetailsQuery();
  const formDataRef = useRef(new FormData());

  const { loading, error, success, data } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [preview, setPreview] = useState(null);
  const [farmerData, setFarmerData] = useState({
    name: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    profilePicture: "",
    bio: "",

    farmName: "",
    farmLocation: {
      latitude: "",
      longitude: "",
    },
    farmSizeInAcres: "",
    cropsGrown: [],
  });

  useEffect(() => {
    if (response) {
      const {
        data: {
          name,
          profilePicture,
          phoneNumber,
          bio,
          farmName,
          farmSizeInAcres,
          cropsGrown,
          address,
          farmLocation,
        },
      } = response;
      setFarmerData({
        name: name || "",
        bio: bio || "",
        profilePicture: profilePicture || "",
        phoneNumber: phoneNumber || "",
        farmName: farmName || "",
        farmSizeInAcres: farmSizeInAcres || "",
        cropsGrown: cropsGrown || [],
        address: {
          buildingName: address?.buildingName || "",
          street: address?.street || "",
          city: address?.city || "",
          state: address?.state || "",
          country: address?.country || "",
          postalCode: address?.postalCode || "",
        },
        farmLocation: {
          latitude: farmLocation?.latitude || "",
          longitude: farmLocation?.longitude || "",
        },
      });

      if (response?.data?.profilePicture) {
        setPreview(
          `${import.meta.env.VITE_API_SERVER_URL}/uploads/profile-pictures/${
            response.data.profilePicture
          }`
        );
      }
    }

    refetch();
  }, [response]);

  const onChangeHandler = (e, parentKey = null) => {
    const { name, value } = e.target;

    setFarmerData((prev) => {
      if (parentKey) {
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [name]: value,
          },
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleProfileUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      formDataRef.current.set("profilePicture", file);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      enqueueSnackbar(err?.message || err?.data?.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar(data?.message, { variant: "success" });
    }

    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  }, [success, error, dispatch, data]);

  if (!response) {
    return <p>Loading ...</p>;
  }
  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="flex">
        <div className="flex flex-col">
          <section className="mt-3">
            <h2 className="font-semibold mb-1">Personal Details</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Name  */}
              <InputField
                name="name"
                type="text"
                label="Name"
                value={farmerData?.name}
                placeHolder="Enter your name"
                onChangeHandler={onChangeHandler}
              />

              <div className="phone-input">
                <label>Phone Number</label>
                <PhoneInput
                  defaultCountry="IN"
                  name="phoneNumber"
                  className="input-field"
                  placeholder="Enter your phone number"
                  value={farmerData?.phoneNumber}
                  onChange={(value) => {
                    setFarmerData((prev) => ({ ...prev, phoneNumber: value }));
                  }}
                />
              </div>

              {/* Bio  */}
              <InputField
                name="bio"
                type="text"
                label="Bio"
                value={farmerData.bio}
                placeHolder="Enter your bio"
                onChangeHandler={onChangeHandler}
              />
            </div>
            <button
              onClick={() =>
                dispatch(
                  updateFarmerData({
                    endpoint: "update-pd",
                    data: {
                      name: farmerData.name,
                      phoneNumber: farmerData.phoneNumber,
                      bio: farmerData.bio,
                    },
                  })
                )
              }
              className="mt-3 btn-primary"
            >
              Save Personal details
            </button>
          </section>

          <section className="mt-3">
            <h2 className="font-semibold mb-1">Address</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Building Name  */}
              <InputField
                name="buildingName"
                type="text"
                label="Building Name"
                value={farmerData?.address?.buildingName}
                placeHolder="Enter building name or number"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />

              {/* Street */}
              <InputField
                name="street"
                type="text"
                label="Street"
                value={farmerData?.address?.street}
                placeHolder="Enter your street"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />

              {/* City */}
              <InputField
                name="city"
                type="text"
                label="City"
                value={farmerData?.address?.city}
                placeHolder="Enter your city"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />

              {/* State */}
              <InputField
                name="state"
                type="text"
                label="State"
                value={farmerData?.address?.state}
                placeHolder="Enter your State"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />

              {/* Country */}
              <InputField
                name="country"
                type="text"
                label="Country"
                value={farmerData?.address?.country}
                placeHolder="Enter your Country"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />

              {/* Postal */}
              <InputField
                name="postalCode"
                type="text"
                label="Postal Code"
                value={farmerData?.address?.postalCode}
                placeHolder="Enter your Postal code"
                onChangeHandler={onChangeHandler}
                parentKey="address"
              />
            </div>
            <button
              onClick={() =>
                dispatch(
                  updateFarmerData({
                    endpoint: "update-address",
                    data: {
                      buildingName: farmerData.address.buildingName,
                      street: farmerData.address.street,
                      city: farmerData.address.city,
                      postalCode: farmerData.address.postalCode,
                      state: farmerData.address.state,
                      country: farmerData.address.country,
                    },
                  })
                )
              }
              className="mt-3 btn-primary"
            >
              Update Address
            </button>
          </section>

          <section className="mt-3">
            <h2 className="font-semibold mb-1">Farm Details</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Farm name */}
              <InputField
                name="farmName"
                type="text"
                label="Farm Name"
                value={farmerData?.farmName}
                placeHolder="Enter your farm name"
                onChangeHandler={onChangeHandler}
              />

              {/* Farm size */}
              <InputField
                name="farmSizeInAcres"
                type="text"
                label="Farm Size (in Acres)"
                value={farmerData?.farmSizeInAcres}
                placeHolder="Enter your farm size"
                onChangeHandler={onChangeHandler}
              />
            </div>
          </section>
          <section className=" mt-3">
            <h3 className="font-semibold mt-3">Farm Location</h3>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                name="latitude"
                type="text"
                label="Latitude"
                value={farmerData?.farmLocation?.latitude}
                placeHolder="Enter latitude"
                onChangeHandler={onChangeHandler}
                parentKey="farmLocation"
              />

              <InputField
                name="longitude"
                type="text"
                label="Longitude"
                value={farmerData?.farmLocation?.longitude}
                placeHolder="Enter longitude"
                onChangeHandler={onChangeHandler}
                parentKey="farmLocation"
              />
            </div>
            <button
              onClick={() =>
                dispatch(
                  updateFarmerData({
                    endpoint: "add-farm",
                    data: {
                      farmName: farmerData.farmName,
                      farmSizeInAcres: farmerData.farmSizeInAcres,
                      farmLocation: {
                        latitude: farmerData.farmLocation.latitude,
                        longitude: farmerData.farmLocation.longitude,
                      },
                      cropsGrown: farmerData.cropsGrown,
                    },
                  })
                )
              }
              className="mt-3 btn-primary"
            >
              Save Farm details
            </button>
          </section>
        </div>

        <div className="flex flex-col ml-10 items-center">
          {preview && (
            <img
              className="w-48 h-48 object-cover rounded-full mb-3 shadow-md"
              src={preview}
            />
          )}
          <label htmlFor="profile-photo">
            <AddToPhotosOutlinedIcon
              fontSize="large"
              className="bg-black rounded-full p-2 mb-1 text-white cursor-pointer transition-transform hover:scale-105"
            />
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profile-photo"
            onChange={handleProfileUpload}
          />

          <button
            onClick={() => {
              dispatch(uploadProfilePhoto(formDataRef.current));
            }}
            className="mt-3 btn-primary"
          >
            Upload photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
