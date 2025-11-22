import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
  name:"propertydetails",
  initialState:{
    propertyDetails: null,
    errors: null,
    loading: false,
  },
  reducers:{
    setListRequest(state){
      state.loading = true;
    },
    getPropertyDetails(state,action){
      state.propertyDetails = action.payload;
      state.loading = false;
    },
    getErrors(state,action){
      state.errors = action.payload;
      state.loading = false
    },
  },
});

export const propertyDetailsActions = propertyDetailsSlice.actions;
export default propertyDetailsSlice;