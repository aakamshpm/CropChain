import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  Container,
  Box,
  Rating,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CropIcon from "@mui/icons-material/Agriculture";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  fetchFarmerDetails,
  addOrUpdateRating,
  getAverageRating,
} from "../utils/farmerSlice";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const dispatch = useDispatch();
  const {
    farmerData: farmer,
    loading,
    error,
    averageRating,
  } = useSelector((state) => state.farmer);

  const { userId } = useSelector((state) => state.user);

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  console.log(farmer);

  useEffect(() => {
    dispatch(fetchFarmerDetails(farmerId));
    dispatch(getAverageRating(farmerId));

    if (userId && farmer && farmer.ratings) {
      const userRating = farmer.ratings.find((r) => r.userId === userId);
      if (userRating) {
        setRatingValue(userRating.rating);
      } else {
        setRatingValue(0);
      }
    }
  }, [dispatch, farmerId, userId]);

  const handleRateFarmer = () => {
    dispatch(
      addOrUpdateRating({ farmerId, userId, rating: ratingValue, comment })
    )
      .unwrap()
      .then(() => {
        setSnackbarMessage("Rating submitted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        dispatch(getAverageRating(farmerId)); // Refresh the average rating
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to submit rating: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!farmer) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Farmer not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          {/* Farmer Header */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            mb={4}
          >
            {farmer?.profilePicture && (
              <Avatar
                src={
                  `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                    farmer.profilePicture
                  }` || "/default-avatar.png"
                }
                alt={farmer.name}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="h4" fontWeight="bold">
              {farmer.name || "N/A"}
              {farmer.verificationStatus === "approved" && (
                <VerifiedIcon sx={{ color: "green", ml: 1 }} />
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {farmer.farmName || "N/A"}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Personal and Farm Details */}
          <Grid container spacing={4}>
            {/* Personal Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                <HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Personal Details
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography>
                  <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  <strong>Phone:</strong> {farmer.phoneNumber || "N/A"}
                </Typography>
                <Typography mt={2}>
                  <strong>Address:</strong>{" "}
                  {farmer?.address
                    ? `${farmer.address.buildingName || ""}, ${
                        farmer.address.street || ""
                      }, ${farmer.address.city || ""}, ${
                        farmer.address.state || ""
                      }, ${farmer.address.postalCode || ""}, ${
                        farmer.address.country || ""
                      }`
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>

            {/* Farm Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                <CropIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Farm Details
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography>
                  <strong>Farm Size:</strong>{" "}
                  {farmer.farmSizeInAcres
                    ? `${farmer.farmSizeInAcres} acres`
                    : "N/A"}
                </Typography>
                <Typography mt={2}>
                  <strong>Location:</strong>{" "}
                  {farmer.farmLocation ? (
                    <>
                      <LocationOnIcon
                        sx={{ color: "red", mr: 1, verticalAlign: "middle" }}
                      />
                      {farmer.farmLocation.latitude},{" "}
                      {farmer.farmLocation.longitude}
                    </>
                  ) : (
                    "N/A"
                  )}
                </Typography>
                <Typography mt={2}>
                  <strong>Crops Grown:</strong>{" "}
                  {farmer.cropsGrown?.length > 0
                    ? farmer.cropsGrown.join(", ")
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Rating Section */}

          {userId && (
            <Box textAlign="center" mb={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Rate This Farmer
              </Typography>
              <Rating
                name="farmer-rating"
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Add a comment (optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleRateFarmer}
                disabled={ratingValue === 0}
              >
                Submit Rating
              </Button>
            </Box>
          )}

          {/* Average Rating */}
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Average Rating
            </Typography>
            <Rating
              name="average-rating"
              value={averageRating || 0}
              readOnly
              precision={0.1}
              size="large"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">
              {averageRating
                ? `${averageRating.toFixed(1)} out of 5`
                : "No ratings yet"}
            </Typography>
          </Box>

          {/* Verification Status */}
          <Box textAlign="center" mt={4}>
            <Chip
              label={
                farmer.verificationStatus === "approved"
                  ? "Verified Farmer"
                  : farmer.verificationStatus === "pending"
                  ? "Verification Pending"
                  : farmer.verificationStatus === "rejected"
                  ? "Verification Rejected"
                  : "N/A"
              }
              color={
                farmer.verificationStatus === "approved"
                  ? "success"
                  : farmer.verificationStatus === "pending"
                  ? "warning"
                  : farmer.verificationStatus === "rejected"
                  ? "error"
                  : "default"
              }
              icon={
                farmer.verificationStatus === "approved" ? (
                  <VerifiedIcon />
                ) : null
              }
              sx={{ mt: 2 }}
            />
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FarmerDetails;
