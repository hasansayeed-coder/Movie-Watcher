const baseUrl = "https://api.themoviedb.org/3/";
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params);
  return `${endpoint}?${qs}`;
};

export default { getUrl, baseUrl, key };