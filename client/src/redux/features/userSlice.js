// ✅ Full updated userSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    listFavorites: [],
    listWatchlist: [],      // ← add
    recentlyViewed: []      // ← add
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("actkn");
      } else {
        if (action.payload.token) {
          localStorage.setItem("actkn", action.payload.token);
        }
      }
      state.user = action.payload;
    },

    // Favorites
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    },
    removeFavorite: (state, action) => {
      const { mediaId } = action.payload;
      state.listFavorites = state.listFavorites.filter(
        e => e.mediaId.toString() !== mediaId.toString()
      );
    },

    // Watchlist
    setListWatchlist: (state, action) => {
      state.listWatchlist = action.payload;
    },
    addToWatchlist: (state, action) => {
      state.listWatchlist = [action.payload, ...state.listWatchlist];
    },
    removeFromWatchlist: (state, action) => {
      const { mediaId } = action.payload;
      state.listWatchlist = state.listWatchlist.filter(
        e => e.mediaId.toString() !== mediaId.toString()
      );
    },
    toggleWatchlistItem: (state, action) => {
      const { id } = action.payload;
      state.listWatchlist = state.listWatchlist.map(e =>
        e.id === id ? { ...e, watched: !e.watched } : e
      );
    },

    // Recently Viewed
    setRecentlyViewed: (state, action) => {
      state.recentlyViewed = action.payload;
    },
    addRecentlyViewed: (state, action) => {
      // Remove duplicate then add to top
      const filtered = state.recentlyViewed.filter(
        e => e.mediaId.toString() !== action.payload.mediaId.toString()
      );
      state.recentlyViewed = [action.payload, ...filtered].slice(0, 10);
    },
    removeRecentlyViewed: (state, action) => {
      const { mediaId } = action.payload;
      state.recentlyViewed = state.recentlyViewed.filter(
        e => e.mediaId.toString() !== mediaId.toString()
      );
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    }
  }
});

export const {
  setUser,
  setListFavorites,
  addFavorite,
  removeFavorite,
  setListWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  toggleWatchlistItem,
  setRecentlyViewed,
  addRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed
} = userSlice.actions;

export default userSlice.reducer;