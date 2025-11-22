import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getBookingDetails, getCheckoutSession, getUserBooking, verifyPaymentAndCreateBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// get all bookings
bookingRouter.get("/",protect, getUserBooking);

// get details of specific booking using bookingId
bookingRouter.get("/:bookingId", protect, getBookingDetails);

// Checkout session for razorpay
bookingRouter.post("/checkout-session", protect, getCheckoutSession);

// Create Bookings
bookingRouter
  .route("/verify-payment")
  .post(protect, verifyPaymentAndCreateBooking);

export {bookingRouter};