import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, ListItemButton, ListItemIcon, ListItemText, Menu, Stack, Typography } from "@mui/material";
import menuConfigs from "../../configs/menu.configs.js";
import { Link } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice.js";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import userApi from "../../api/modules/user.api.js";
import TextAvatar from "./TextAvatar.jsx";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);

  const onSignout = async () => {
    await userApi.signout();     
    dispatch(setUser(null));     
    setAnchorEl(null);
  };

  return (
    <>
      {user && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={toggleMenu}
          >
            {/* Show real avatar if uploaded, otherwise text avatar */}
            {user.avatarUrl ? (
              <Avatar src={user.avatarUrl} sx={{ width: 35, height: 35 }} />
            ) : (
              <TextAvatar text={user.displayName} />
            )}
            <Typography variant="h6">{user.displayName}</Typography>
          </Stack>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { padding: 0 } }}
          >
            {menuConfigs.user.map((item, index) => (
              <ListItemButton
                component={Link}
                to={item.path}
                key={index}
                onClick={() => setAnchorEl(null)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography textTransform="uppercase">{item.display}</Typography>
                } />
              </ListItemButton>
            ))}
            <ListItemButton
              sx={{ borderRadius: "10px" }}
              onClick={onSignout}
            >
              <ListItemIcon><LogoutOutlinedIcon /></ListItemIcon>
              <ListItemText disableTypography primary={
                <Typography textTransform="uppercase">sign out</Typography>
              } />
            </ListItemButton>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu;