import axiosClient from "./tmdb.client.js";
import tmdbEndpoints from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaList: ({ mediaType, mediaCategory, page }) =>
    axiosClient.get(tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })),

  mediaDetail: ({ mediaType, mediaId }) =>
    axiosClient.get(tmdbEndpoints.mediaDetail({ mediaType, mediaId })),

  mediaGenres: ({ mediaType }) =>
    axiosClient.get(tmdbEndpoints.mediaGenres({ mediaType })),

  mediaCredits: ({ mediaType, mediaId }) =>
    axiosClient.get(tmdbEndpoints.mediaCredits({ mediaType, mediaId })),

  mediaVideos: ({ mediaType, mediaId }) =>
    axiosClient.get(tmdbEndpoints.mediaVideos({ mediaType, mediaId })),

  mediaRecommend: ({ mediaType, mediaId }) =>
    axiosClient.get(tmdbEndpoints.mediaRecommend({ mediaType, mediaId })),

  mediaImages: ({ mediaType, mediaId }) =>
    axiosClient.get(tmdbEndpoints.mediaImages({ mediaType, mediaId })),

  mediaSearch: ({ mediaType, query, page }) =>
    axiosClient.get(tmdbEndpoints.mediaSearch({ mediaType, query, page })),

  personDetail: ({ personId }) =>
    axiosClient.get(tmdbEndpoints.personDetail({ personId })),

  personMedias: ({ personId }) =>
    axiosClient.get(tmdbEndpoints.personMedias({ personId }))
};

export default tmdbApi;