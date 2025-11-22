import { axiosInstance } from "../../utils/axios";
import { accomodationActions } from "./accomodation-slice.js";

export const createAccomodation = (accomodationData) => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());
    const response = await axiosInstance.post("/api/v1/rent/user/newAccomodation",accomodationData);

    if(!response) throw new Error("Could not get any Accomodation");


  } catch (error) {
    dispatch(accomodationActions.getErrors(error.response.data.message));
  }
};

export const getAllAccomodations = () => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());
    const {data} = await axiosInstance.get("/api/v1/rent/user/myAccomodation");

    const accom = data.data;

    dispatch(accomodationActions.getAccomodation(accom))
  } catch (error) {
    dispatch(accomodationActions.getErrors(error.response.data.message));
  }
}