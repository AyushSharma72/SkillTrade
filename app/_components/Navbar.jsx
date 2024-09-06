"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../assests/logo.png";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Navbar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const pathname = usePathname();
  return (
    <div className="bg-black  text-white ">
      {/* navbar big screen  */}
      <div className="w-3/4  justify-between m-auto  sm:flex hidden">
        <Image src={logo} className="w-[200px] h-[70px]"></Image>
        <div className="xl:w-1/4 sm:w-1/2 flex items-center justify-around font-bold">
          <Link href="/" className={`${pathname === "/" ? "border-b-2 " : ""}`}>
            Home
          </Link>
          <Link
            href="/register"
            className={`${pathname === "/register" ? "border-b-2 " : ""}`}
          >
            Register
          </Link>
          <Link
            href="/login"
            className={`${pathname === "/login" ? "border-b-2 " : ""}`}
          >
            Login
          </Link>
        </div>
      </div>

      {/* small screen navbar */}
      <div className="sm:hidden">
        <Box className="flex justify-between">
          <CssBaseline />
          <AppBar
            position="fixed"
            open={open}
            style={{
              backgroundColor: "#000000",
              backdropFilter: "blur(10px)",
            }}
          >
            <Toolbar className="flex justify-between">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    mr: 2,
                  },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              <Image src={logo} className="w-[200px] h-[70px]"></Image>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <Link href="/" className="m-auto flex">
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="Home" />
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <Link href="register" className="m-auto flex">
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="Register" />
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <Link href="login" className="m-auto flex">
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="Login" />
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </Drawer>
        </Box>
      </div>
    </div>
  );
};

export default Navbar;
