import privateClient from "../client/private.client";

const favoriteEndpoints = {
  list: "user/favorites",
  add: "user/favorites",
  remove: ({ favoriteId }) => `user/favorites/${favoriteId}`
};

const favoriteApi = {
  

  getList: async ({ page = 1, pageSize = 100 } = {}) => {
  try {
    const response = await privateClient.get(
      `${favoriteEndpoints.list}?page=${page}&pageSize=${pageSize}`
    );
    return { response };
  } catch (err) { return { err }; }
},
  
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    mediaRate
  }) => {
    try {
      const response = await privateClient.post(
        favoriteEndpoints.add,
        {
          mediaId,
          mediaType,
          mediaTitle,
          mediaPoster,
          mediaRate
        }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ favoriteId }) => {
    try {
      const response = await privateClient.delete(favoriteEndpoints.remove({ favoriteId }));

      return { response };
    } catch (err) { return { err }; }
  }
};

export default favoriteApi;