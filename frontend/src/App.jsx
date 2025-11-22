import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import PropertyListing from "./Components/PropertyListing/PropertyListing";
import Main from "./Components/Home/Main";
import PropertyList from "./Components/Home/PropertyList";
import Accomodation from "./Components/Accomodation/Accomodation";
import Login from "./Components/User/Login";
import Signup from "./Components/User/Signup";
import Profile from "./Components/User/Profile";
import EditProfile from "./Components/User/EditProfile";
import MyBookings from "./Components/Mybookings/MyBookings";
import BookingDetails from "./Components/Mybookings/BookingDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "./store/Users/user-action";
import { Toaster } from "react-hot-toast";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgetPassword from "./Components/User/ForgetPassword";
import ResetPassword from "./Components/User/ResetPassword";
import Payment from "./Components/Payment/Payment";
import NotFound from "./Components/NotFound";
import AccomodationForm from "./Components/Accomodation/AccomodationForm";

function App() {

  const dispatch = useDispatch();
  const { errors, user } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Main />} id="main" exact>
        <Route id="home" index element={<PropertyList />} />
        <Route
          element={<PropertyListing />}
          id="propertyListing"
          path="propertylist/:id"
          exact
        />
        {/* Login */}
        <Route id="login" path="login" element={<Login />} />

        <Route id="signup" path="signup" element={<Signup />} />

        <Route
          id="profile"
          path="profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          id="editprofile"
          path="editprofile"
          element={user ? <EditProfile /> : <Navigate to="/login" />}
        />

        <Route
          id="updatepassword"
          path="user/updatePassword"
          element={user ? <UpdatePassword /> : <Navigate to="/login" />}
        />

        <Route
          id="forgotpassword"
          path="user/forgotPassword"
          element={<ForgetPassword />}
        />

        <Route
          id="resetpassword"
          path="user/resetPassword/:token"
          element={<ResetPassword />}
        />

        {/* accomendation */}
        <Route
          id="accomodation"
          path="accomodation"
          element={<Accomodation />}
        />

        <Route
          id="accomodationform"
          path="accomodationform"
          element={<AccomodationForm />}
        />
        <Route
          id="mybookings"
          path="user/bookings"
          element={user ? <MyBookings /> : <Navigate to={"/login"} />}
        />
        <Route
          id="bookingdetails"
          path="user/bookings/:bookingId"
          element={user ? <BookingDetails /> : <Navigate to={"/login"} />}
        />
        <Route
          id="payment"
          path="payment/:propertyId"
          element={user ? <Payment /> : <Navigate to={"/login"} />}
        />

        {/* Catch all routes for 404 Not Found must be the last Route*/}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    )
  );
  return (
    <div className="App">
      {/* <Home /> */}
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
