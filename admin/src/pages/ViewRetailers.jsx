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
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const ViewRetailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/retailer/fetch-all`,
          { withCredentials: true }
        );
        setRetailers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch retailers");
      } finally {
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Loading Retailers...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h4" className="mb-8 font-bold text-gray-800">
          Registered Retailers
        </Typography>

        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Phone</TableCell>
                <TableCell className="font-semibold">Business Name</TableCell>
                <TableCell className="font-semibold">Joined Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {retailers.map((retailer) => (
                <TableRow
                  key={retailer._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    {retailer.firstName + " " + retailer.lastName}
                  </TableCell>
                  <TableCell>{retailer.phoneNumber}</TableCell>
                  <TableCell>
                    {retailer.shopAddress.shopName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {dayjs(retailer.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {retailers.length === 0 && (
          <Paper className="p-6 mt-6 text-center shadow-lg">
            <Typography variant="h6" className="text-gray-600">
              No retailers found in the database
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default ViewRetailers;
