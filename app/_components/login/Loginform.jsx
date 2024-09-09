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

const LoginForm = () => {
  const [auth, SetAuth] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
    <div className="relative flex justify-around sm:mt-20 mt-28">
      <Toaster />

      <Image
        src={loginimage}
        className="lg:w-[500px] lg:h-[400px] sm:w-[300px] sm:h-[300px] hidden md:block"
      />
      <div className="flex flex-col items-center md:w-[40%] sm:w-3/4 w-[90%]">
        <p className="font-bold text-2xl mt-5">LOGIN</p>
        <form
          className="w-full flex justify-center flex-col items-center gap-y-10 mt-5"
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

          <Button type="submit">Login</Button>
        </form>

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
