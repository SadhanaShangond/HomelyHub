import React from "react";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/Users/user-action";
import toast from "react-hot-toast";
import { propertyActions } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-actions";

const Header = () => {

  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout());
    toast.success("User Logged out Successfully");
    navigate("/");
  };

  const refreshFunction = () => {
    dispatch(propertyActions.updateSearchParams({}));
    dispatch(getAllProperties());
  }


  return (
    <>
      <nav className='header row sticky-top '>
        <Link>
          <img src='/assets/logo.png' alt='logo' className='logo' onClick={refreshFunction} />
        </Link>
        <div className='search_filter'>
          <Search />
          <Filter />
        </div>
        {!isAuthenticated && !user && (
          <Link to='/login'>
            <span className='material-symbols-outlined web_logo'>account_circle</span>
          </Link>
        )}
        {isAuthenticated && user && (
          <div className="dropdown">
            <span
              className="material-symbols-outlined web_logo dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.avatar.url && (
                <img src={user.avatar.url} alt="icon" className="user-img rounded-circle h-25 w-25" />
              )}
              {!user.avatar.url && "account_circle"}
            </span>

            <ul
              className="dropdown-menu"
              aria-labelledby="dropdownMenuLink"
            >
              <li>
                <Link className="dropdown-item" to="/profile">
                  {" "}
                  My Account
                </Link>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={logoutUser}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};
export default Header;
