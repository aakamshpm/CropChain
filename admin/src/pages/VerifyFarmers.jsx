import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch applied farmers
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/farmer/fetch-applied-farmers`,
          { withCredentials: true }
        );
        setFarmers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch farmers.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Navigate to farmer details page
  const handleViewDetails = (farmerId) => {
    navigate(`/verify-farmers/${farmerId}`);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Loading Farmers...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h4" className="mb-8 font-bold text-gray-800">
          Farmers Applied for Verification
        </Typography>

        {farmers.length > 0 ? (
          <TableContainer component={Paper} className="shadow-lg">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="font-semibold text-gray-700">
                    Name
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Aadhaar Number
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Confidence Score
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Status
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farmers.map((farmer) => (
                  <TableRow
                    key={farmer._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{farmer.firstName + " " + farmer.lastName}</TableCell>
                    <TableCell>{farmer.aadhaarNumber || "N/A"}</TableCell>
                    <TableCell>{farmer.confidenceScore || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          farmer.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {farmer.verified ? "Verified" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(farmer._id)}
                        className="normal-case"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper className="p-6 mt-4 shadow-lg text-center">
            <Typography variant="h6" className="text-gray-600">
              No farmers have applied for verification yet.
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default VerifyFarmers;
