import axios from "axios";

const get = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity" // prevents axios decompression bug
      }
    });
    return response.data; // ← make sure this says .data
  } catch (e) {
    throw new Error(`TMDB request failed [${e.response?.status}]: ${e.message}`);
  }
};

export default { get };