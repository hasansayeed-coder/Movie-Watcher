const tmdbEndpoints = {
  mediaList: ({ mediaType, mediaCategory, page }) =>
    `${mediaType}/${mediaCategory}?page=${page}`,

  mediaDetail: ({ mediaType, mediaId }) =>
    `${mediaType}/${mediaId}`,

  mediaGenres: ({ mediaType }) =>
    `genre/${mediaType}/list`,

  mediaCredits: ({ mediaType, mediaId }) =>
    `${mediaType}/${mediaId}/credits`,

  mediaVideos: ({ mediaType, mediaId }) =>
    `${mediaType}/${mediaId}/videos`,

  mediaRecommend: ({ mediaType, mediaId }) =>
    `${mediaType}/${mediaId}/recommendations`,

  mediaImages: ({ mediaType, mediaId }) =>
    `${mediaType}/${mediaId}/images`,

  mediaSearch: ({ mediaType, query, page }) =>
    `search/${mediaType}?query=${query}&page=${page}`,

  personDetail: ({ personId }) =>
    `person/${personId}`,

  personMedias: ({ personId }) =>
    `person/${personId}/combined_credits`
};

export default tmdbEndpoints;