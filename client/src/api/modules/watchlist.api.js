import privateClient from "../client/private.client.js";

const watchlistEndpoints = {
  list: "watchlist",
  add: "watchlist",
  remove: ({ watchlistId }) => `watchlist/${watchlistId}`,
  toggleWatched: ({ watchlistId }) => `watchlist/${watchlistId}/watched`
};

const watchlistApi = {
  getList: async ({ page = 1, pageSize = 100, watched } = {}) => {
    try {
      let query = `?page=${page}&pageSize=${pageSize}`;
      if (watched !== undefined) query += `&watched=${watched}`;
      const response = await privateClient.get(`${watchlistEndpoints.list}${query}`);
      return { response };
    } catch (err) { return { err }; }
  },
  add: async ({ mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }) => {
    try {
      const response = await privateClient.post(
        watchlistEndpoints.add,
        { mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ watchlistId }) => {
    try {
      const response = await privateClient.delete(
        watchlistEndpoints.remove({ watchlistId })
      );
      return { response };
    } catch (err) { return { err }; }
  },
  toggleWatched: async ({ watchlistId }) => {
    try {
      const response = await privateClient.patch(
        watchlistEndpoints.toggleWatched({ watchlistId })
      );
      return { response };
    } catch (err) { return { err }; }
  }
};

export default watchlistApi;