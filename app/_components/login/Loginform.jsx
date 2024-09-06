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

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-around  sm:mt-20 mt-28">
      <Image src={loginimage} className="lg:w-[400px] lg:h-[400px] sm:w-[300px] sm:h-[300px] hidden md:block"></Image>
      <div className="flex flex-col items-center  md:w-[40%] sm:w-3/4 w-[90%]">
        <p className="font-bold text-2xl mt-5">LOGIN</p>
        <form className=" w-full flex justify-center flex-col items-center gap-y-10 mt-5">
          <TextField
            id="standard-basic"
            label="Mobile Number"
            variant="outlined"
            className="w-full"
            required
            type="tel"
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            id="standard-password"
            label="Password"
            variant="outlined"
            className="w-full"
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

          <Button>Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
