import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { selectPaymentDetails, selectPaymentStatus } from '../../store/Payment/payment-slice';
import toast from 'react-hot-toast';
import { initiateCheckoutSession, verifyPayment } from '../../store/Payment/payment-actions';
// import { theme } from 'antd';

const Payment = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useSelector(state => state.user);
  const {
    checkInDate,
    checkOutDate,
    totalPrice,
    propertyName,
    guests,
    nights,
  } = useSelector(selectPaymentDetails);

  const { loading, error, orderData } = useSelector(selectPaymentStatus);

  const loadRazorPayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    })
  }

  const handleBooking = async () => {
    const isLoaded = await loadRazorPayScript();
    if (!isLoaded) {
      toast.error("Failed to loadRazorpay SDK");
      return;
    }
    dispatch(initiateCheckoutSession({
      amount: totalPrice,
      currency: "INR",
      propertyId,
      fromDate: checkInDate,
      toDate: checkOutDate,
      guests: guests,
    }));
  };

  useEffect(() => {
    if (!orderData) return;

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Homely Hub",
      description: `Booking for ${propertyName}`,
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          await dispatch(verifyPayment({
            razorpayData: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            bookingDetails: {
              propertyId,
              fromDate: checkInDate,
              toDate: checkOutDate,
              guests: guests,
              totalAmount: totalPrice,
            },
          }));

          toast.success("Booking Confirmed 😀. Redirecting...");
          navigate("/user/bookings");
        } catch (error) {
          toast.error("Payment verification failed 😢");
          navigate("/");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || "",
      },
      notes: {
        property_id: propertyId,
        property_name: propertyName,
      },
      theme: {
        color: "#FF5A5F",
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment Cancelled")
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }, [orderData, dispatch]);

  console.log("ORDER DATA FROM BACKEND:", orderData);

  return (
    <div className='booking-container'>
      <div className="property-details">
        <h2>{propertyName}</h2>
        <p>{totalPrice}</p>
      </div>
      <div className="booking-from">
        <div className="form-group">
          <label htmlFor="">Check In Date: </label>
          <input type="text" disabled value={checkInDate} />
        </div>

        <div className="form-group">
          <label htmlFor="">Check Out Date: </label>
          <input type="text" disabled value={checkOutDate} />
        </div>

        <div className="form-group">
          <label htmlFor="">Number of Guests</label>
          <input type="number" disabled value={guests} />
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Total Amount: ₹{totalPrice}</p>
          <p>Number of Nights: {nights}</p>
        </div>

        {error && (
          <div className='error-meassage'>
            {error}
          </div>
        )}
        <button
          onClick={handleBooking}
          disabled={loading}
          className='book-now-btn'
        >
          {loading ? "Processing..." : `Book Now ₹${totalPrice}`}
        </button>
      </div>
    </div>
  )
}

export default Payment
