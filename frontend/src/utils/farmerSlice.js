import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const farmerUrl = "http://localhost:8000/api/farmer";

const initialState = {
  farmerData: {},
  loading: false,
  success: null,
  error: null,
  averageRating: 0, // Add averageRating to the state
};

// Async Thunk: Fetch Farmer Details
export const fetchFarmerDetails = createAsyncThunk(
  "farmer/fetchFarmerDetails",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${farmerUrl}/get-one?farmerId=${farmerId}`
      );
      return response.data.farmer; // Return the fetched farmer data
    } catch (error) {
      return rejectWithValue(error || error?.response?.data); // Return error message
    }
  }
);

// Async Thunk: Add or Update Rating
export const addOrUpdateRating = createAsyncThunk(
  "farmer/addOrUpdateRating",
  async ({ farmerId, userId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${farmerUrl}/${farmerId}/ratings`, {
        userId,
        rating,
        comment,
      });
      return response.data; // Return the updated farmer data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async Thunk: Get Average Rating
export const getAverageRating = createAsyncThunk(
  "farmer/getAverageRating",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${farmerUrl}/${farmerId}/ratings/average`
      );
      return response.data.averageRating; // Return the average rating
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Create Farmer Slice
const farmerSlice = createSlice({
  name: "farmer",
  initialState,
  reducers: {
    resetFarmerState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Farmer Details
    builder
      .addCase(fetchFarmerDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerData = action.payload;
        state.success = true;
      })
      .addCase(fetchFarmerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Add or Update Rating
    builder
      .addCase(addOrUpdateRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateRating.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerData = action.payload.farmer; // Update farmer data with new rating
        state.success = true;
      })
      .addCase(addOrUpdateRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Get Average Rating
    builder
      .addCase(getAverageRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRating.fulfilled, (state, action) => {
        state.loading = false;
        state.averageRating = action.payload; // Update averageRating in state
        state.success = true;
      })
      .addCase(getAverageRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetFarmerState } = farmerSlice.actions;

export default farmerSlice.reducer;
