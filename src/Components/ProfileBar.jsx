import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { Settings, Help,Logout as Logout1 } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useContext, useState } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { NavLink } from "react-router-dom";
import { SnackBarContext } from "../App";
import { Logout } from "../lib/firebase";

export default function ProfileBar() {
  const { currentUser } = useContext(AuthContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const profileMenuItems = [
    {
      label: "My Profile",
      icon: <AccountCircleIcon />,
      to: `/Profile/${currentUser.userId}`,
    },
    {
      label: "Edit Profile",
      icon: <Settings />,
      to: "/editProfile",
    },
    {
      label: "Help",
      icon: <Help />,
      to: "/help",
    },
    {
      label: "Sign Out",
      icon: <Logout1 />,
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const res = await Logout();
    if (res) {
      setSnackBar({
        message: "Logout Succesfully...",
        open: true,
        style: "success",
      });
    } else {
      setSnackBar({
        message: "Logout Failed...",
        open: true,
        style: "error",
      });
    }
  };

  return (
    <div className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular pl-1">
      <IconButton onClick={handleClick} sx={{ color: "white" }}>
        <Avatar alt="tania andrew" src={currentUser.picture} />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {profileMenuItems.map((item, key) =>
          item.label === "Sign Out" ? (
            <MenuItem
              key={key}
              onClick={() => {
                handleLogout();
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {item.icon}
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
              </Box>
            </MenuItem>
          ) : (
            <MenuItem
              key={key}
              onClick={handleClose}
              component={NavLink}
              to={item.to}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {item.icon}
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
              </Box>
            </MenuItem>
          )
        )}
      </Menu>
    </div>
  );
}
