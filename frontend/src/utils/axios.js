import axios from "axios";
import qs from "qs";

// Serializtion -> converting object or array into an url query String that can be sent in an HTTP request.

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params,{arrayFormat: "repeat"}),
})