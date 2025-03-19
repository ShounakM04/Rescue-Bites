// features/consumer/consumerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  availableListings: [], // Food listings visible to the consumer
  bookings: [], // Bookings made by the consumer
  filters: { veg: null, searchQuery: "" }, // Consumer's filters
  loading: false,
  error: null,
};

const consumerSlice = createSlice({
  name: "consumer",
  initialState,
  reducers: {
    setAvailableListings: (state, action) => {
      state.availableListings = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
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

export const { setAvailableListings, addBooking, setFilters, setLoading, setError } = consumerSlice.actions;
export default consumerSlice.reducer;