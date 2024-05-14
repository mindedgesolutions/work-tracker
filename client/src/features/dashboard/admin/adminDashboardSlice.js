import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  remarkChartData: [],
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: initialState,
  reducers: {
    setRemarkChartData: (state, action) => {
      state.remarkChartData = action.payload;
    },
    unsetRemarkChartData: (state) => {
      state.remarkChartData = [];
    },
  },
});

export const { setRemarkChartData, unsetRemarkChartData } =
  adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
