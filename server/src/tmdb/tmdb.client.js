import axios from "axios";

const baseURL = "https://api.themoviedb.org/3/";
const key = process.env.TMDB_KEY;

const axiosClient = axios.create({
  baseURL
});

axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    params: {
      ...config.params,
      api_key: key
    }
  };
});

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response.data;
});

export default axiosClient;