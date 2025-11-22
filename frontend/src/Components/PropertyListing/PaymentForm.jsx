import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentDetails } from "../../store/Payment/payment-slice";

const PaymentForm = ({
  propertyId,
  price,
  propertyName,
  address,
  maximumGuest,
  currentBookings,
}) => {
  console.log(maximumGuest)
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { RangePicker } = DatePicker;
  const { isAuthenticated } = useSelector(state => state.user);

  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "",
      name: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      // console.log(value);
      const [checkInDate, checkOutDate] = value.dateRange;
      const nights = moment(checkOutDate).diff(moment(checkInDate), "days");
      const { name, guests, phoneNumber } = value;

      if (name && guests && phoneNumber && checkInDate && checkOutDate) {
        await dispatch(
          setPaymentDetails({
            checkInDate,
            checkOutDate,
            totalPrice: calculatedPrice,
            propertyName,
            address,
            guests,
            nights,
          })
        );
        navigate(`/payment/${propertyId}`)
      } else {
        alert("Please fill all fields correctly before proceeding");
      }
    }
  });

  let disableDates = currentBookings.map((dates) => ({
    start: new Date(dates.fromDate),
    end: new Date(new Date(dates.toDate)).setHours(23, 59, 59, 999),
  }));

  const isDiasabled = (current) => {
    return (
      current.isBefore(moment(), "day") || disableDates.some(
        ({ start, end }) => current.toDate() >= start && current.toDate() <= end
      )
    );
  };


  return (
    <div className="form-container">
      <form className="payment-form" onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
        <div className="price-pernight">
          Price: <b>&#8377;{price}</b>
          <span> / Per night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDiasabled}
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const nights = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        // console.log(nights);


                        const total = price * nights;
                        setCalculatedPrice(total);
                      } else {
                        setCalculatedPrice(0);
                      }
                    }}
                  />
                </Space>
              </div>
            )}
          </form.Field>
          <form.Field
            name="guests"
            validators={{
              onChange: ({ value }) => value > 0 && value <= maximumGuest
                ? undefined
                : `Guests must be 1 - ${maximumGuest}`,
            }}
          >
            {(field) => (
              <div className="guest">
                <label className="payment-labels">Number of guests:</label>
                <br></br>
                <input
                  type="number"
                  className="no-of-guest"
                  placeholder="Guest"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></input>
                {/* {console.log(field.state.value)} */}
                {
                  field.state.meta.errors && (
                    <p style={{ color: "red" }}>{field.state.meta.errors}</p>
                  )
                }
              </div>
            )}
          </form.Field>
          <div className="name-phoneno">
            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">Your full name:</label> <br></br>
                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                  <br></br>
                </>
              )}
            </form.Field>
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">Phone Number:</label> <br></br>
                  <input
                    type="number"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="book-place">
          {!isAuthenticated ? (
            <button>
              <Link
                to={"/login"}
                style={{ textDecoration: "none", color: "white" }}
              >
                Login to Book
              </Link>
            </button>
          ) : (
            <button>Book this place &#8377; {calculatedPrice}</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
