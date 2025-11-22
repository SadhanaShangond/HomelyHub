import { propertyActions } from "./property-slice.js";
import { axiosInstance } from "../../utils/axios.js";

export const getAllProperties = () => async(dispatch, getState) => {
  try {
    dispatch(propertyActions.setRequest());
    const {searchParams} = getState().properties;
    // console.log(searchParams);

    const response = await axiosInstance.get(`/api/v1/rent/listing`,{
      params: {...searchParams},
    });

    if(!response){ 
      throw new Error("Could not fetch any property");
    }
    // console.log(response);
    
    const {data} = response;
    // console.log(data);
    
    dispatch(propertyActions.getProperties(data));
  } catch (error) {
    dispatch(propertyActions.getErrors(
      error.response?.data?.message || error.message || "Something went wrong"
    ));
  }
}