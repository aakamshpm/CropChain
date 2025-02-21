import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/farmer/get-all`,
          { withCredentials: true }
        );
        setFarmers(response.data.farmers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch farmers:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load farmers. Please try again later.
      </Typography>
    );
  if (farmers.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No farmers available.
      </Typography>
    );

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, py: 5 }}>
      <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
        Available Farmers
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {farmers.map((farmer) => (
          <Card
            key={farmer._id}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 3,
              },
            }}
            onClick={() => navigate(`/farmer/${farmer._id}`)}
          >
            {farmer.profilePicture ? (
              <CardMedia
                component="img"
                sx={{ height: "200px", objectFit: "contain" }}
                image={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                  farmer.profilePicture
                }`}
                alt={`${farmer.name}'s profile`}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
                bgcolor="action.hover"
              >
                <AccountCircleIcon sx={{ fontSize: 100, color: "grey.500" }} />
              </Box>
            )}
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {farmer.firstName + " " + farmer.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Farm Name:</strong> {farmer.farmName || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {farmer.address?.city},{" "}
                {farmer.address?.state}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Crops:</strong> {farmer.cropsGrown?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ViewFarmers;
