import Razorpay from "razorpay";
import {Property} from "../models/propertyModel.js";
import crypto from "crypto";
import {Booking} from "../models/bookingModel.js"
import moment from "moment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Step-1: Create a Razorpay order (before booking creation)
const getCheckoutSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Please login first",
      });
    }

    const { amount, currency, propertyId, fromDate, toDate, guests } = req.body;

    // Validate the dates and availability before creating the order
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    // ✅ Check availability (corrected logic + syntax)
    const isBooked = property.currentBookings.some((booking) => {
      const bookingFrom = new Date(booking.fromDate);
      const bookingTo = new Date(booking.toDate);
      const requestedFrom = new Date(fromDate);
      const requestedTo = new Date(toDate);

      // If requested dates overlap with existing booking
      return (
        (requestedFrom >= bookingFrom && requestedFrom <= bookingTo) ||
        (requestedTo >= bookingFrom && requestedTo <= bookingTo)
      );
    });

    if (isBooked) {
      return res.status(400).json({
        status: "fail",
        message: "Property is not available for the selected dates",
      });
    }

    // ✅ Create Razorpay order
    const options = {
      amount: amount * 100, // convert to paise
      currency: currency || "INR",
      receipt: `booking_${Date.now()}_${req.user.name}`,
      notes: {
        propertyId,
        propertyName: property.propertyName,
        userId: req.user._id.toString(),
        fromDate,
        toDate,
        guests: guests.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      propertyName: property.name,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};


//Step:2 Verify payment and Create booking

const verifyPaymentAndCreateBooking = async (req,res) => {
  try {
    const {razorpayData,bookingDetails} = req.body;
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=razorpayData;

    //verify payment signature
    const body = razorpay_order_id + "|"+razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    if(expectedSignature !== razorpay_signature){
      return res.status(400).json({
        status:"fail",
        message:"Payment Verification failed",
      })
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if(payment.status !== "captured"){
      return res.status(400).json({
        status:"fail",
        message:"Payment not Completed",
      })
    }

    //Extract booking Details from payment notes or request body

    const {propertyId,fromDate,toDate,guests,totalAmount}=bookingDetails;

    const fromDateMoment = moment(fromDate);
    const toDateMoment = moment(toDate);

    const numberOfnights = toDateMoment.diff(fromDateMoment,"days");

    //Create Bookings with payment details
    const booking = await Booking.create({
      property:propertyId,
      price:totalAmount,
      guests,
      fromDate,
      toDate,
      numberOfnights,
      user:req.user._id,
      paymentStatus:"completed",
      razorpayOrderId:razorpay_order_id,
      razorpayPaymentId:razorpay_payment_id,
      razorpaySignature:razorpay_signature,
      paidAt:new Date(),
    })

    //Push the booking data inside the properties currentbooking

    const updateProperty = await Property.findByIdAndUpdate(propertyId,{
      $push:{
        currentBookings:{
          bookingId:booking._id,
          fromDate,
          toDate,
          userId:req.user._id,
        }
      }
      
    })

    res.status(200).json({
      status:"success",
      message:"Booking Creates Successfully",
      data:{
        booking,
        paymentId:razorpay_payment_id,
      },
    });

  } catch (error) {
    console.error("Booking creation error",error);
    res.status(500).json({
      status:"fail",
      message:"Failed to create booking",
      error:error.message,
    })
  }
}

//Bookings of a paticular user
const getUserBooking = async (req,res) => {
  try {
    const bookings = await Booking.find({user:req.user._id});
    res.status(200).json({
      status:"Success",
      data:{bookings},
    })
  } catch (error) {
    res.status(401).json({
      status:"fail",
      message:error.message,
    })
  }
}

//Booking Details by bookingId
const getBookingDetails = async (req,res) => {
  try {
    const bookings = await Booking.findById(req.params.bookingId);
    res.status(200).json({
      status: "Success",
      data: { bookings },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
}

export {
  getCheckoutSession,
  verifyPaymentAndCreateBooking,
  getBookingDetails,
  getUserBooking,
};
