const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

if (!baseUrl || !key) {
  throw new Error("Missing TMDB_BASE_URL or TMDB_KEY in environment variables");
}

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params || {});
  return `${baseUrl}${endpoint}?api_key=${key}&${qs}`;
};

export default { getUrl };