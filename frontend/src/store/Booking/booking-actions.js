import { axiosInstance } from "../../utils/axios";
import { setBookings, setBookingDetails  } from "./booking-slice";

export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/rent/user/booking/${bookingId}`
    );

    if(!response) throw new Error("Failed to get booking details");

    dispatch(setBookingDetails(response.data.data));
  } catch (error) {
    console.error(error.respose?.data?.message || error.message);
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/api/v1/rent/user/booking");

    if(!response) throw new Error("Failed to fetch User bookings");

    dispatch(setBookings(response.data.data.bookings));
    console.log(response.data.data.bookings);
    
  } catch (error) {
    console.error(error.respose?.data?.message || error.message);
  }
};

