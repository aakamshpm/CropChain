import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import axios from "axios";

const ViewFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all farmers
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/farmer/get-all`,
          { withCredentials: true }
        );
        setFarmers(response.data.farmers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch farmers");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

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
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h4" className="mb-8 font-bold text-gray-800">
          Registered Farmers
        </Typography>

        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Total Crops</TableCell>
                <TableCell className="font-semibold">Phone</TableCell>
                <TableCell className="font-semibold">Joined Date</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {farmers.map((farmer) => (
                <TableRow
                  key={farmer._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    {farmer.firstName + " " + farmer.lastName}
                  </TableCell>
                  <TableCell>{farmer.cropsGrown.length || "N/A"}</TableCell>
                  <TableCell>{farmer.phoneNumber || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(farmer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={farmer.verified ? "Verified" : "Pending"}
                      className={`text-sm ${
                        farmer.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {farmers.length === 0 && (
          <Paper className="p-6 mt-6 text-center shadow-lg">
            <Typography variant="h6" className="text-gray-600">
              No farmers found in the database
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default ViewFarmers;
