"use client";
import React,{useEffect} from "react";
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
import { useAuth } from "../_context/UserAuthContent";
import Menu from "../_components/NavBarComponenets/menu";
import WorkerMenu from "./NavBarComponenets/WorkerMenu";
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
  const [auth, setauth] = useAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

 
  useEffect(() => {
    
  }, [auth]); // Watch for changes to the `auth` state

  const pathname = usePathname();
  return (
    <div className="bg-black flex justify-center text-white sticky top-0 z-[10]">
      {/* navbar big screen  */}
      <div className="w-full  xl:w-3/4 justify-between sm:flex hidden">
        <Image src={logo} className="w-[200px] h-[70px]"></Image>
        <div className=" xl:w-1/2 sm:w-1/2 flex items-center justify-around xl:justify-around font-bold">
          {auth?.user?.role == 0 ? (
            <>
              <Link
                href="/"
                className={`${pathname === "/" ? "border-b-2 " : ""}`}
              >
                Home
              </Link>{" "}
              <Link
                href="/user/create_request"
                className={`${
                  pathname === "/user/create_request" ? "border-b-2 " : ""
                }`}
              >
                Create request
              </Link>
              <Menu />
            </>
          ) : auth?.user?.role == 1 ? (
            <>
              <Link
                href="/"
                className={`${pathname === "/" ? "border-b-2 " : ""}`}
              >
                Home
              </Link>{" "}
              <Link
                href="/worker/all_request"
                className={`${
                  pathname === "/worker/all_request" ? "border-b-2 " : ""
                }`}
              >
                All Requests
              </Link>
              <WorkerMenu />
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`${pathname === "/" ? "border-b-2 " : ""}`}
              >
                Home
              </Link>{" "}
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
            </>
          )}
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
