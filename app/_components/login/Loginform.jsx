"use client";
import React, { useState } from "react";
import Image from "next/image";
import loginimage from "../../assests/login.svg";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/app/_context/UserAuthContent";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const LoginForm = () => {
  const [auth, SetAuth] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function HandleLogin(event) {
    event.preventDefault();
    setLoading(true); // Start loading

    // Create FormData from the form event
    const formData = new FormData(event.target);

    const MobileNo = formData.get("MobileNo");
    const Password = formData.get("Password");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/UserLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            MobileNo,
            Password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        SetAuth({
          ...auth,
          user: data.user ? data.user : data.worker,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: data.user ? data.user : data.worker,
            token: data.token,
          })
        );
        event.target.reset();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="relative flex justify-around sm:mt-20 ">
      <Toaster />

      <Image
        src={loginimage}
        className="lg:w-[500px] lg:h-[400px] sm:w-[300px] sm:h-[300px] hidden md:block"
      />
      <div className="flex flex-col items-center md:w-[40%] sm:w-3/4 w-[90%] formshadow py-5 px-2 rounded-md h-fit">
        <p className="font-bold text-2xl ">LOGIN</p>
        <form
          className="w-full flex justify-center flex-col items-center gap-y-10"
          onSubmit={HandleLogin}
        >
          <TextField
            id="standard-basic"
            label="Mobile Number"
            variant="outlined"
            className="w-full"
            required
            type="tel"
            inputProps={{ maxLength: 10 }}
            name="MobileNo"
          />
          <div className="w-full flex flex-col gap-2  items-end">
            <TextField
              id="standard-password"
              label="Password"
              variant="outlined"
              className="w-full"
              name="Password"
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <span
              className="text-right w-[132px] cursor-pointer"
              onClick={handleOpen}
            >
              Forgot password?
            </span>
          </div>

          <Button type="submit">Login</Button>
        </form>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p className="text-center text-xl">Forgot Password ?</p>
          </Box>
        </Modal>
        {/* backdrop */}

        {loading && (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
