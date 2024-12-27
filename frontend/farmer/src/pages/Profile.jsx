import { useEffect, useState } from "react";
import { useGetFarmerDetailsQuery } from "../auth/authService";
import InputField from "../components/InputField";

const Profile = () => {
  const { data: response, isLoading, refetch } = useGetFarmerDetailsQuery();

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
    if (!isLoading) {
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
    }
  }, [response]);

  const onChangeHandler = (e) => {};

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <div className="flex flex-col">
        <InputField
          name={[farmerData.name]}
          type="text"
          label="Name"
          value={farmerData.name}
          placeHolder="Enter your name"
          onChangeHandler={onChangeHandler}
        />
      </div>
    </div>
  );
};

export default Profile;
