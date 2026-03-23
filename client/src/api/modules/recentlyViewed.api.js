import privateClient from "../client/private.client.js";

const recentlyViewedApi = {
  getList: async () => {
    try {
      const response = await privateClient.get("recently-viewed");
      return { response };
    } catch (err) { return { err }; }
  },
  add: async ({ mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }) => {
    try {
      const response = await privateClient.post(
        "recently-viewed",
        { mediaId, mediaType, mediaTitle, mediaPoster, mediaRate }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ mediaId }) => {
    try {
      const response = await privateClient.delete(`recently-viewed/${mediaId}`);
      return { response };
    } catch (err) { return { err }; }
  },
  clear: async () => {
    try {
      const response = await privateClient.delete("recently-viewed/clear");
      return { response };
    } catch (err) { return { err }; }
  }
};

export default recentlyViewedApi;