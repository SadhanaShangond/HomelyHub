import { axiosInstance } from "../../utils/axios.js";
import { userActions } from "./user-slice.js";


export const getSignup = (user) => async (dispatch) => {
  try {
    dispatch(userActions.setSignupRequest());
    const {data} = await axiosInstance.post("/api/v1/rent/user/signup", user);
    dispatch(userActions.getSignupDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const getLogin = (user) => async (dispatch) => {
  try {
    dispatch(userActions.setLoginRequest);
    const {data} = await axiosInstance.post("/api/v1/rent/user/login", user);
    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.setCurrentUserRequest());
    const {data} = await axiosInstance.get("/api/v1/rent/user/me");
    // console.log(data);
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const updateUser = (updateUser) => async (dispatch) => {
  try{
    dispatch(userActions.setUpdateUserRequest());
    await axiosInstance.patch("/api/v1/rent/user/updateMe",updateUser);

    const {data} =  await axiosInstance.get("/api/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user));
  } catch(error){
    dispatch(userActions.getError(error.response.data.message));
  }
}

// Passwords

export const forgotPassword = (email) => async(dispatch) => {
  try {
    await axiosInstance.post("/api/v1/rent/user/forgotPassword",{email});
  } catch (error) {
   dispatch(userActions.getError(error.response.data.message)); 
  }
};

export const resetPassword = (rePassword, token) => async(dispatch) => {
  try {
    await axiosInstance.patch(`/api/v1/rent/user/resetPassword/${token}`,rePassword);
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

// update Password
export const updatePassword = (passwords) => async(dispatch) => {
  try {
    dispatch(userActions.setPasswordRequest());
    await axiosInstance.patch("/api/v1/rent/user/updateMyPassword", passwords);
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

// Logout 
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.get("/api/v1/rent/user/logout");
    dispatch(userActions.getLogout(null));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
}
