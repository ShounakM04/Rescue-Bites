// features/provider/providerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listings: [], // Provider's food listings
  acceptedRequests: [], // Bookings accepted by the provider
  metrics: null, // Provider's performance metrics
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setListings, addListing, setMetrics, setLoading, setError } = providerSlice.actions;
export default providerSlice.reducer;