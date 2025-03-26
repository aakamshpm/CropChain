import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { retailerLogin, retailerRegister } from "./actions/retailerActions";
import { consumerLogin, consumerRegister } from "./actions/consumerActions";

const serverUrl = `${import.meta.env.VITE_API_SERVER_URL}/api`;

// Async Thunk: Fetch User Details
export const fetchUserProfile = createAsyncThunk(
  "farmer/fetchUserProfile",
  async ({ role }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverUrl}/${role}`, {
        withCredentials: true,
      });
      return response.data.data; // Return the fetched user data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async Thunk: Update User Profile
export const updateUserProfile = createAsyncThunk(
  "farmer/updateUserProfile",
  async ({ role, formData: data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/${role}/edit-profile`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data; // Return the fetched user data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async Thunk: Update User Address
export const updateUserAddress = createAsyncThunk(
  "farmer/updateUserAddress",
  async ({ role, address }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/${role}/edit-address`,
        address,
        {
          withCredentials: true,
        }
      );
      return response.data; // Return the fetched user address
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

const initialState = {
  userData: {},
  address: {},
  role: null,
  loading: false,
  success: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { role, data, address } = action.payload;
      state.userData = data;
      state.address = address;
      state.role = role;
    },
    clearCredentials: (state) => {
      state.userId = null;
      state.role = null;
      localStorage.removeItem("token");
    },
    resetMessageState: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register retailer
    builder.addCase(retailerRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(retailerRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(retailerRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // login retailer
    builder.addCase(retailerLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(retailerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(retailerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // register consumer
    builder.addCase(consumerRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(consumerRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(consumerRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // login consumer
    builder.addCase(consumerLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(consumerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(consumerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //fetch user data
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log(action.payload);
        state.userData = action.payload.data;
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Address
    builder.addCase(updateUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(updateUserAddress.fulfilled, (state, action) => {
        state.address = action.payload.data;
        state.loading = false;
        state.error = null;
        state.success = true;
      }),
      builder.addCase(updateUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, clearCredentials, resetMessageState } =
  userSlice.actions;
export default userSlice.reducer;
