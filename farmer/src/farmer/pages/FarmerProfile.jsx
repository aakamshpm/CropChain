import { useEffect, useRef, useState } from "react";
import { useGetFarmerDetailsQuery } from "../auth/authService";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { updateFarmerData, uploadProfilePhoto } from "../auth/farmerActions";
import {
  Box,
  Chip,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationCity as CityIcon,
  Map as MapIcon,
  Flag as FlagIcon,
  LocalPostOffice as PostalIcon,
  Agriculture as FarmIcon,
  Straighten as MeasureIcon,
  Public as GlobeIcon,
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  Crop as CropIcon,
} from "@mui/icons-material";
import CropManage from "../components/CropManage";

const Profile = () => {
  const CITIES_IN_KERALA = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ];

  const formDataRef = useRef(new FormData());
  const { data: response, refetch } = useGetFarmerDetailsQuery();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [isModalOpen, setIsModalOpen] = useState(false); // Toggle for the modal
  const [preview, setPreview] = useState(null);
  const [farmerData, setFarmerData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    profilePicture: "",
    aadhaarNumber: "",

    farmName: "",
    farmLocation: {
      latitude: "",
      longitude: "",
    },
    farmSizeInAcres: "",
    cropsGrown: [],
    newCrop: "",
  });

  useEffect(() => {
    if (response) {
      const {
        data: {
          firstName,
          lastName,
          profilePicture,
          phoneNumber,
          aadhaarNumber,
          farmName,
          farmSizeInAcres,
          cropsGrown,
          address,
          farmLocation,
        },
      } = response;
      setFarmerData({
        firstName: firstName || "",
        lastName: lastName || "",
        aadhaarNumber: aadhaarNumber || "",
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
        newCrop: "",
      });

      if (response?.data?.profilePicture) {
        setPreview(
          `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
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

  const handleUpdateProfile = async () => {
    const updateData = {
      firstName: farmerData.firstName,
      lastName: farmerData.lastName,
      phoneNumber: farmerData.phoneNumber,
      aadhaarNumber: farmerData.aadhaarNumber,
      buildingName: farmerData.address.buildingName,
      street: farmerData.address.street,
      city: farmerData.address.city,
      state: farmerData.address.state,
      country: farmerData.address.country,
      postalCode: farmerData.address.postalCode,
      farmName: farmerData.farmName,
      farmSizeInAcres: farmerData.farmSizeInAcres,
      latitude: farmerData.farmLocation.latitude,
      longitude: farmerData.farmLocation.longitude,
      cropsGrown: farmerData.cropsGrown,
    };

    try {
      const response = await dispatch(updateFarmerData(updateData)).unwrap();
      enqueueSnackbar(response.message || "Success", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err, {
        variant: "error",
      });
    }
  };

  if (!response) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="flex flex-col p-10 w-full">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <PersonIcon fontSize="large" /> Farmer Profile
      </h1>

      <Grid container spacing={4}>
        <Grid xs={12} md={8}>
          <Paper elevation={3} className="p-6 rounded-lg">
            {/* Personal Details Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PersonIcon /> Personal Information
              </h2>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={farmerData.firstName}
                    onChange={onChangeHandler}
                    name="firstName"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={farmerData.lastName}
                    onChange={onChangeHandler}
                    name="lastName"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <div className="phone-input">
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={farmerData.phoneNumber}
                      onChange={(e) =>
                        setFarmerData({
                          ...farmerData,
                          phoneNumber: e.target.value,
                        })
                      }
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                          inputComponent: PhoneInput,
                          inputProps: {
                            international: true,
                            defaultCountry: "IN",
                          },
                        },
                      }}
                    />
                  </div>
                </Grid>

                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Aadhaar Number"
                    value={farmerData.aadhaarNumber}
                    onChange={onChangeHandler}
                    name="aadhaarNumber"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </section>

            {/* Address Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HomeIcon /> Address Details
              </h2>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Building Name"
                    value={farmerData.address.buildingName}
                    onChange={(e) => onChangeHandler(e, "address")}
                    name="buildingName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Street"
                    value={farmerData.address.street}
                    onChange={(e) => onChangeHandler(e, "address")}
                    name="street"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    value={farmerData.address.city}
                    onChange={(e) => onChangeHandler(e, "address")}
                    name="city"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CityIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {CITIES_IN_KERALA.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={farmerData.address.postalCode}
                    onChange={(e) => onChangeHandler(e, "address")}
                    name="postalCode"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PostalIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </section>

            {/* Farm Details Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FarmIcon /> Farm Information
              </h2>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Farm Name"
                    value={farmerData.farmName}
                    onChange={onChangeHandler}
                    name="farmName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FarmIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Farm Size (Acres)"
                    value={farmerData.farmSizeInAcres}
                    onChange={onChangeHandler}
                    name="farmSizeInAcres"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MeasureIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={farmerData.farmLocation.latitude}
                    onChange={(e) => onChangeHandler(e, "farmLocation")}
                    name="latitude"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GlobeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={farmerData.farmLocation.longitude}
                    onChange={(e) => onChangeHandler(e, "farmLocation")}
                    name="longitude"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GlobeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <Box className="flex flex-col">
                    <Chip
                      icon={<CropIcon />}
                      label={`Manage Crops (${farmerData.cropsGrown.length})`}
                      onClick={() => setIsModalOpen(true)}
                      variant="outlined"
                      color="primary"
                      sx={{
                        py: 2,
                        fontSize: "1rem",
                        "& .MuiChip-icon": { ml: 1 },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </section>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleUpdateProfile}
              sx={{ mt: 3 }}
            >
              Update Profile
            </Button>
          </Paper>
        </Grid>

        {/* Profile Picture Section */}
        <Grid xs={12} md={4}>
          <Paper elevation={3} className="p-6 rounded-lg text-center">
            <div className="relative inline-block">
              {preview && (
                <img
                  className="w-48 h-48 object-cover rounded-full mb-4 shadow-lg"
                  src={preview}
                  alt="Profile"
                />
              )}
              <label
                htmlFor="profile-photo"
                className="absolute bottom-2 right-2"
              >
                <IconButton
                  color="primary"
                  component="span"
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  <CameraIcon sx={{ color: "white" }} />
                </IconButton>
              </label>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-photo"
              onChange={handleProfileUpload}
            />

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ImageIcon />}
              onClick={() => dispatch(uploadProfilePhoto(formDataRef.current))}
              sx={{ mt: 2 }}
            >
              Upload Profile Picture
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <CropManage
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        cropsGrown={farmerData.cropsGrown}
        farmerData={farmerData}
        setFarmerData={setFarmerData}
      />
    </div>
  );
};

export default Profile;
