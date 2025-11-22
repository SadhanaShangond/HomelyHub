import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Users/user-slice";
import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDeatils-slice";
import bookingSlice from "./Booking/booking-slice";
import paymentSlice from "./Payment/payment-slice";
import accomodationSlice from "./Accomodation/accomodation-slice";

const store = configureStore({
  reducer:{
    user: userSlice.reducer,
    properties: propertySlice.reducer, 
    propertydetails: propertyDetailsSlice.reducer,
    payment: paymentSlice.reducer,
    booking: bookingSlice.reducer,
    accomodation: accomodationSlice.reducer,
  }
});

export default store;