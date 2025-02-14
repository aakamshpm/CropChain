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
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const ViewConsumers = () => {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/consumer/get-all`,
          { withCredentials: true }
        );
        setConsumers(response.data.consumers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch consumers");
      } finally {
        setLoading(false);
      }
    };

    fetchConsumers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Loading Consumers...
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
          Registered Consumers
        </Typography>

        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Phone</TableCell>
                <TableCell className="font-semibold">Location</TableCell>
                <TableCell className="font-semibold">Joined Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {consumers.map((consumer) => (
                <TableRow
                  key={consumer._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{consumer.name}</TableCell>
                  <TableCell>{consumer.phoneNumber}</TableCell>
                  <TableCell>
                    {[consumer.address?.city, consumer.address?.state]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>
                    {dayjs(consumer.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {consumers.length === 0 && (
          <Paper className="p-6 mt-6 text-center shadow-lg">
            <Typography variant="h6" className="text-gray-600">
              No consumers found in the database
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default ViewConsumers;
