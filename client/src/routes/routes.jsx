import HomePage from "../pages/HomePage.jsx";
import PersonDetail from "../pages/PersonDetail.jsx";
import FavoriteList from "../pages/FavoriteList.jsx";
import WatchlistPage from "../pages/WatchlistPage.jsx";
import RecentlyViewedPage from "../pages/RecentlyViewedPage.jsx";
import MediaDetail from "../pages/MediaDetail.jsx";
import MediaList from "../pages/MediaList.jsx";
import MediaSearch from "../pages/MediaSearch.jsx";
import PasswordUpdate from "../pages/PasswordUpdate.jsx";
import ReviewList from "../pages/ReviewList.jsx";
import ProtectedPage from "../components/common/ProtectedPage.jsx";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import UserProfilePage from "../pages/UserProfilePage.jsx";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  mediaSearch: "/search",
  person: (id) => `/person/${id}`,
  favoriteList: "/favorites",
  watchlist: "/watchlist",                    
  recentlyViewed: "/recently-viewed",         
  reviewList: "/reviews",
  passwordUpdate: "/password-update",         
  verifyEmail: "/verify-email",               
  forgotPassword: "/forgot-password",         
  resetPassword: "/reset-password",           
  userProfile: "/profile"                     
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/person/:personId",
    element: <PersonDetail />,
    state: "person.detail"
  },
  {
    path: "/search",
    element: <MediaSearch />,
    state: "search"
  },

  // Auth routes — public
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
    state: "verify.email"
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    state: "forgot.password"
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
    state: "reset.password"
  },

  // Protected routes — require login
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: "password.update"
  },
  {
    path: "/profile",
    element: (
      <ProtectedPage>
        <UserProfilePage />
      </ProtectedPage>
    ),
    state: "user.profile"
  },
  {
    path: "/favorites",
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: "favorites"
  },
  {
    path: "/watchlist",
    element: (
      <ProtectedPage>
        <WatchlistPage />
      </ProtectedPage>
    ),
    state: "watchlist"
  },
  {
    path: "/recently-viewed",
    element: (
      <ProtectedPage>
        <RecentlyViewedPage />
      </ProtectedPage>
    ),
    state: "recently.viewed"
  },
  {
    path: "/reviews",
    element: (
      <ProtectedPage>
        <ReviewList />
      </ProtectedPage>
    ),
    state: "reviews"
  },

  // Wildcard routes — must stay last
  {
    path: "/:mediaType",
    element: <MediaList />
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail />
  }
];

export default routes;