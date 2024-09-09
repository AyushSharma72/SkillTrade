"use client";
import React, { useState } from "react";
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

const UserRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [auth, setauth] = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function RegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const Name = formData.get("Name");
    const MobileNo = formData.get("MobileNumber");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const Address = formData.get("Address");

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/v1/users/UserRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            MobileNo,
            Email,
            Password,
            Address,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("please try again");
    }
  }

  return (
    <div className="flex flex-col  items-center">
      <Toaster />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <p className="font-bold text-2xl mt-5">Create User Account</p>
      <form
        className=" w-full flex justify-center flex-col items-center gap-y-8 mt-5"
        onSubmit={RegisterUser}
      >
        <TextField
          id="standard-basic"
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Name"
        />
        <TextField
          id="standard-basic"
          label="Mobile Number"
          variant="outlined"
          className="w-3/4"
          required
          type="tel"
          inputProps={{ maxLength: 10 }}
          name="MobileNumber"
        />
        <TextField
          id="standard-basic"
          label="Email"
          variant="outlined"
          className="w-3/4"
          required
          type="email"
          name="Email"
        />
        <TextField
          id="standard-password"
          label="Password"
          variant="outlined"
          className="w-3/4"
          required
          name="Password"
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
        <TextField
          id="standard-basic"
          label="Full Address"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Address"
        />
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default UserRegisterForm;
