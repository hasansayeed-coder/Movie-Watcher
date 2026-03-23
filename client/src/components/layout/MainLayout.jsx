import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import userApi from "../../api/modules/user.api.js";
import favoriteApi from "../../api/modules/favorite.api.js";
import { setListFavorites, setUser } from "../../redux/features/userSlice.js";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../common/Footer.jsx";
import Topbar from "../common/Topbar.jsx";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Check if token exists and get user info on app load
  useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem("actkn");

      // ✅ Skip API call entirely if no token
      if (!token) {
        dispatch(setUser(null));
        return;
      }

      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) {
        // ✅ Silently clear user on 401, don't toast
        dispatch(setUser(null));
      }
    };

    authUser();
  }, [dispatch]);

  // Load favorites when user logs in
  useEffect(() => {
    const getFavorites = async () => {
  const result = await favoriteApi.getList();
  if (!result) return;
  const { response, err } = result;
  if (response) dispatch(setListFavorites(response.results || response));
  if (err) toast.error(err.message || "Failed to load favorites");
};

    if (user) getFavorites();
    if (!user) dispatch(setListFavorites([]));
  }, [user, dispatch]);

  return (
    <>
      <Box display="flex" minHeight="100vh">
        <Topbar />
        <Box
          component="main"
          flexGrow={1}
          overflow="hidden"
          minHeight="100vh"
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;