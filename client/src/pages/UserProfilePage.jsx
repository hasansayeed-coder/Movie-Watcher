import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import avatarApi from "../api/modules/avatar.api.js";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import { setUser } from "../redux/features/userSlice.js";
import { routesGen } from "../routes/routes.jsx";

const UserProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [onUpload, setOnUpload] = useState(false);
  const [onRemove, setOnRemove] = useState(false);

  const onAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setOnUpload(true);
    const { response, err } = await avatarApi.upload({ formData });
    setOnUpload(false);
    if (err) toast.error(err.message);
    if (response) {
      dispatch(setUser({ ...user, avatarUrl: response.avatarUrl }));
      toast.success("Avatar updated!");
    }
  };

  const onRemoveAvatar = async () => {
    if (onRemove) return;
    setOnRemove(true);
    const { response, err } = await avatarApi.remove();
    setOnRemove(false);
    if (err) toast.error(err.message);
    if (response) {
      dispatch(setUser({ ...user, avatarUrl: null }));
      toast.success("Avatar removed");
    }
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="Your Profile">
        <Stack spacing={4} maxWidth="400px">

          {/* Avatar */}
          <Stack alignItems="center" spacing={2}>
            <Avatar
              src={user?.avatarUrl}
              sx={{ width: 120, height: 120, fontSize: "3rem" }}
            >
              {user?.displayName?.[0]?.toUpperCase()}
            </Avatar>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              ref={fileInputRef}
              onChange={onAvatarChange}
            />
            <Stack direction="row" spacing={1}>
              <LoadingButton
                variant="contained"
                loading={onUpload}
                onClick={() => fileInputRef.current.click()}
              >
                {user?.avatarUrl ? "Change Avatar" : "Upload Avatar"}
              </LoadingButton>
              {user?.avatarUrl && (
                <LoadingButton
                  variant="outlined"
                  color="error"
                  loading={onRemove}
                  onClick={onRemoveAvatar}
                >
                  Remove
                </LoadingButton>
              )}
            </Stack>
          </Stack>

          <Divider />

          {/* User Info */}
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight="700">
              {user?.displayName}
            </Typography>
            <Typography color="text.secondary">
              @{user?.username}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="text.secondary">Email:</Typography>
              {user?.isVerified ? (
                <Typography color="success.main">✅ Verified</Typography>
              ) : (
                <Typography color="warning.main">⚠️ Not verified</Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          {/* Quick links */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
              Quick Links
            </Typography>
            <Typography
              component={Link}
              to={routesGen.favoriteList}
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Your Favorites
            </Typography>
            <Typography
              component={Link}
              to={routesGen.watchlist}
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Your Watchlist
            </Typography>
            <Typography
              component={Link}
              to={routesGen.reviewList}
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Your Reviews
            </Typography>
            <Typography
              component={Link}
              to={routesGen.passwordUpdate}
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Update Password
            </Typography>
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};

export default UserProfilePage;