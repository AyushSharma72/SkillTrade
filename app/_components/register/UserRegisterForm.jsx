"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";

const UserRegisterForm = () => {
  return (
    <div className="flex flex-col  items-center">
      <p className="font-bold text-2xl mt-5">Create User Account</p>
      <form className=" w-full flex justify-center flex-col items-center gap-y-10 mt-5">
        <TextField
          id="standard-basic"
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
        />
        <TextField
          id="standard-basic"
          label="Mobile Number"
          variant="outlined"
          className="w-3/4"
          required
          type="tel"
          inputProps={{ maxLength: 10 }}
        />
        <TextField
          id="standard-basic"
          label="Email"
          variant="outlined"
          className="w-3/4"
          required
          type="email"
        />
        <TextField
          id="standard-basic"
          label="Full Address"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
        />
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default UserRegisterForm;
