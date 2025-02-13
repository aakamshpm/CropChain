import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; // Import the default styles
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch farmer details
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/farmer/get-one`,
          { params: { farmerId } },
          { withCredentials: true }
        );
        setFarmer(response.data.farmer);
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

  // Handle approve/reject
  const handleVerification = async (status) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/verify-farmer/${farmerId}`,
        { status },
        { withCredentials: true }
      );
      setSuccess(
        `Farmer ${status === "approve" ? "approved" : "rejected"} successfully.`
      );
      setTimeout(() => navigate("/verify-farmers"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update verification status."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h4" className="mb-8 font-bold text-gray-800">
          Farmer Details
        </Typography>
        <Paper className="p-8 shadow-lg">
          {/* Farmer Information Section */}
          <div className="mb-8">
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-gray-700"
            >
              Stored Information
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong className="text-gray-700">Name:</strong>{" "}
                  <span className="text-gray-600">{farmer.name}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong className="text-gray-700">Aadhaar Number:</strong>{" "}
                  <span className="text-gray-600">
                    {farmer.aadhaarNumber || "N/A"}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </div>

          {/* Document Grid */}
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Uploaded Documents
          </Typography>
          <Grid container spacing={4} className="mb-6">
            {/* Aadhaar Document */}
            <Grid item xs={12} md={6}>
              <Typography className="mb-2 font-medium text-gray-700">
                Aadhaar Document:
              </Typography>
              <Zoom>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    farmer.documents?.aadhaarPath
                  }`}
                  alt="Aadhaar Document"
                  className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90"
                />
              </Zoom>
            </Grid>

            {/* Land Document */}
            <Grid item xs={12} md={6}>
              <Typography className="mb-2 font-medium text-gray-700">
                Land Document:
              </Typography>
              <Zoom>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    farmer.documents?.landPath
                  }`}
                  alt="Land Document"
                  className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90"
                />
              </Zoom>
            </Grid>
          </Grid>

          {/* Confidence Score and Status */}
          <div className="space-y-4 mb-6">
            <Typography>
              <strong className="text-gray-700">Confidence Score:</strong>{" "}
              <span className="text-gray-600">
                {farmer.confidenceScore || "N/A"}
              </span>
            </Typography>
            <Typography>
              <strong className="text-gray-700">Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  farmer.verified ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {farmer.verified ? "Verified" : "Pending"}
              </span>
            </Typography>
          </div>

          {/* Approve/Reject Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleVerification("approve")}
              className="flex-1 py-2"
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleVerification("reject")}
              className="flex-1 py-2"
            >
              Reject
            </Button>
          </div>
        </Paper>

        {/* Success Message */}
        {success && (
          <Alert severity="success" className="mt-6">
            {success}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FarmerDetails;
