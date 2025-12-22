import axiosClient from "./tmdb.client.js";
import tmdbEndpoints from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaList: async ({ mediaType, mediaCategory, page }) => {
    console.log('📡 Calling TMDB API:', { mediaType, mediaCategory, page });
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
      );
      console.log('✅ TMDB Response:', response.results?.length, 'items');
      return response;
    } catch (error) {
      console.error('❌ TMDB API Error:', error);
      throw error;
    }
  },
  
  mediaDetail: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaDetail({ mediaType, mediaId })
  ),
  
  mediaGenres: async ({ mediaType }) => {
    console.log('📡 Fetching genres for:', mediaType);
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaGenres({ mediaType })
      );
      console.log('✅ Genres Response:', response.genres?.length, 'genres');
      return response;
    } catch (error) {
      console.error('❌ Genres Error:', error);
      throw error;
    }
  },
  
  mediaCredits: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaCredits({ mediaType, mediaId })
  ),
  
  mediaVideos: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaVideos({ mediaType, mediaId })
  ),
  
  mediaRecommend: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
  ),
  
  mediaImages: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaImages({ mediaType, mediaId })
  ),
  
  mediaSearch: async ({ mediaType, query, page }) => await axiosClient.get(
    tmdbEndpoints.mediaSearch({ mediaType, query, page })
  ),
  
  personDetail: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personDetail({ personId })
  ),
  
  personMedias: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personMedias({ personId })
  ),
};

export default tmdbApi;