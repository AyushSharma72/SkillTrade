"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import logo from "/logo.png";
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
import Menu2 from "../_components/NavBarComponenets/menu";
import WorkerMenu from "./NavBarComponenets/WorkerMenu";
const drawerWidth = 240;
import AdminMenu from "./NavBarComponenets/AdminMenu";
import { Button } from "../../components/ui/button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutModal from "./NavBarComponenets/LogoutModal";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modal, setModalState] = React.useState(false);
  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleOpenModal = () => setModalState(true);
  const handleCloseModal = () => setModalState(false);

  const pathname = usePathname();
  return (
    <div className="bg-black flex justify-center text-white sticky top-0 z-[10] !font-serif">
      {/* navbar big screen  */}
      <div className="w-full  xl:w-3/4 justify-between sm:flex hidden">
        <Image
          src="/logo.png"
          className="w-[200px] h-[70px]"
          alt="skill trade logo"
          width={200}
          height={70}
        ></Image>
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
              <Link
                href="/user/hire"
                className={`${pathname === "/user/hire" ? "border-b-2 " : ""}`}
              >
                Hire
              </Link>
              <Menu2 />
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
                All Request
              </Link>
              <Link
                href="/worker/hire"
                className={`${
                  pathname === "/worker/hire" ? "border-b-2 " : ""
                }`}
              >
                Hiring Requests
              </Link>
              <WorkerMenu />
            </>
          ) : auth?.user?.role == 2 ? (
            <>
              <Link
                href="/"
                className={`${pathname === "/" ? "border-b-2 " : ""}`}
              >
                Home
              </Link>{" "}
              <Link
                href="/admin/verify_worker"
                className={`${
                  pathname === "/admin/verify_worker" ? "border-b-2 " : ""
                }`}
              >
                Verify Workers
              </Link>{" "}
              <AdminMenu />
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
      <LogoutModal modalState={modal} onClose={handleCloseModal}></LogoutModal>
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
              <Image
                src="/logo.png"
                className="w-[200px] h-[70px]"
                alt="Logo"
                width={200}
                height={70}
              />
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
              {/* user  */}
              {auth?.user?.role === 0 && (
                <div className="flex flex-col gap-3">
                  {/* home  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* create request  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/user/create_request" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Create Request" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  {/* hire  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/user/hire"
                        className={`${
                          pathname === "/user/hire" ? "border-b-2 " : ""
                        }`}
                      >
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Create Request" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  {/* dashboard  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      My Account
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/user/User_Profile"> Profile</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/user/view_request"> View Request</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}

              {/* worker  */}
              {auth?.user?.role === 1 && (
                <div className="flex flex-col gap-3">
                  {/* home  */}
                  <ListItem disablePadding>
                    <ListItemButton>
                      <Link
                        href="/"
                        className="m-auto flex"
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* all request  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/worker/all_request" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="All Requests" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  {/* dashboard  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      My Account
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link
                          href={`/worker/worker_profile/${auth?.user?._id}`}
                        >
                          Profile
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/worker/requests">Assigned Requests</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}

              {/* admin  */}
              {auth?.user?.role === 2 && (
                <div className="flex flex-col gap-3">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  {/* admin menu  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      Admin Dashboard
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/admin/reports">View Reports</Link>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/admin/verify_worker">Verify Workers</Link>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}
              {!auth?.user && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/register" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Register" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/login" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Login" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
            <Divider />
          </Drawer>
        </Box>
      </div>
    </div>
  );
};

export default Navbar;
