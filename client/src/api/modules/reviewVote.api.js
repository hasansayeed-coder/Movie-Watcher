import privateClient from "../client/private.client.js";

const reviewVoteApi = {
  getVotes: async ({ reviewId }) => {
    try {
      const response = await privateClient.get(`reviews/${reviewId}/votes`);
      return { response };
    } catch (err) { return { err }; }
  },
  vote: async ({ reviewId, voteType }) => {
    try {
      const response = await privateClient.post(
        `reviews/${reviewId}/votes`,
        { voteType }
      );
      return { response };
    } catch (err) { return { err }; }
  }
};

export default reviewVoteApi;