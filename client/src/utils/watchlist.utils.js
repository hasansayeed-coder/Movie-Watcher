const watchlistUtils = {
  check: ({ listWatchlist, mediaId }) =>
    listWatchlist &&
    listWatchlist.find(e => e.mediaId.toString() === mediaId.toString()) !== undefined
};

export default watchlistUtils;