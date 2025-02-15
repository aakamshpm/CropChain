import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Paper, Avatar, Chip, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CropIcon from "@mui/icons-material/Agriculture";
import HomeIcon from "@mui/icons-material/Home";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/farmer/${farmerId}`
        );
        console.log(response);
        setFarmer(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch farmer details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography>Farmer not found.</Typography>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Paper className="p-6 shadow-lg">
          {/* Farmer Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar
              src={farmer.profilePicture}
              alt={farmer.name}
              className="w-24 h-24 mb-4"
            />
            <Typography variant="h4" className="font-bold">
              {farmer.name}
              {farmer.verificationStatus === "approved" && (
                <VerifiedIcon className="text-green-500 ml-2" />
              )}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              {farmer.farmName}
            </Typography>
          </div>

          <Divider className="my-4" />

          {/* Personal Details */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-2">
                <HomeIcon className="mr-2" />
                Personal Details
              </Typography>
              <Typography>
                <strong>Phone:</strong> {farmer.phoneNumber}
              </Typography>
              {/* <Typography>
                <strong>Address:</strong> {farmer?.address.buildingName},{" "}
                {farmer?.address.street}, {farmer?.address.city},{" "}
                {farmer?.address.state}, {farmer?.address.postalCode},{" "}
                {farmer?.address.country}
              </Typography> */}
            </Grid>

            {/* Farm Details */}
            {/* <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-2">
                <CropIcon className="mr-2" />
                Farm Details
              </Typography>
              <Typography>
                <strong>Farm Size:</strong> {farmer.farmSizeInAcres} acres
              </Typography>
              <Typography>
                <strong>Location:</strong>{" "}
                <LocationOnIcon className="text-red-500" />{" "}
                {farmer.farmLocation.latitude}, {farmer.farmLocation.longitude}
              </Typography>
              <Typography>
                <strong>Crops Grown:</strong>{" "}
                {farmer.cropsGrown.join(", ") || "N/A"}
              </Typography>
            </Grid> */}
          </Grid>

          <Divider className="my-4" />

          {/* Verification Status */}
          <div className="text-center">
            <Chip
              label={
                farmer.verificationStatus === "approved"
                  ? "Verified Farmer"
                  : farmer.verificationStatus === "pending"
                  ? "Verification Pending"
                  : "Verification Rejected"
              }
              color={
                farmer.verificationStatus === "approved"
                  ? "success"
                  : farmer.verificationStatus === "pending"
                  ? "warning"
                  : "error"
              }
              icon={
                farmer.verificationStatus === "approved" ? (
                  <VerifiedIcon />
                ) : null
              }
              className="mt-4"
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default FarmerDetails;
