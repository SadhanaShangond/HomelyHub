import { axiosInstance } from "../../utils/axios";
import { propertyDetailsActions } from "./propertyDeatils-slice";

export const getPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch(propertyDetailsActions.setListRequest());
    const response = await axiosInstance(`/api/v1/rent/listing/${id}`);

    if(!response){
      throw new Error("Could noy fetch property details");
    }
    const {data} = response.data;
    dispatch(propertyDetailsActions.getPropertyDetails(data));
  } catch (error) {
    dispatch(propertyDetailsActions.getErrors(error.response.data.error));
  }
};