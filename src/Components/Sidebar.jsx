import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MessageIcon from "@mui/icons-material/Message";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CssBaseline from "@mui/material/CssBaseline";
import ImagesearchRollerRoundedIcon from "@mui/icons-material/ImagesearchRollerRounded";
import ProfileBar from "./ProfileBar";
import icon from "./111.png";
import { Box } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const data = [
    { icon: <HomeIcon />, to: "/" },
    { icon: <SearchIcon />, to: "/Search" },
    { icon: <ExploreIcon />, to: "/Explore" },
    { icon: <LiveTvIcon />, to: "/Reel" },
    { icon: <MessageIcon />, to: "/Chat" },
    { icon: <AddBoxIcon />, to: "/AddPost" },
    { icon: <ImagesearchRollerRoundedIcon />, to: "/ImageEditor" },
    { icon: <ProfileBar /> },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <CssBaseline />
      <DrawerHeader>
        {open ? (
          <Box sx={{display:'flex',alignItems:'center',alignSelf:'center',gap:1}}>
            <img src={icon} alt="icon" className="h-10 w-10" />
            <p className="font-serif font-bold">
              Reveal Your Life
            </p>
          </Box>
        ) : null}
        <IconButton onClick={handleDrawerClose}>
          {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          "Dashboard",
          "Search",
          "Explore",
          "Reels",
          "Messages",
          "Create",
          "Image Editor",
          "Profile",
        ].map((text, index) => (
          <NavLink to={data[index].to} key={text}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 55,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: "black",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {data[index].icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
}
