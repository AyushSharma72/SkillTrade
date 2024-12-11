"use client";
import React, { useState } from "react";
import Input from "@mui/joy/Input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../_context/UserAuthContent";
import { UpdatePassword } from "./fetchfunction/UpdatePassword";
import { Toaster, toast } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

const UserPassword = () => {
  const [auth] = useAuth();
  const [password, Setpassword] = useState("");
  const [newpassword, Setnewpassword] = useState("");
  const [errors, setErrors] = useState({ password: false, newpassword: false });
  const [open, setOpen] = React.useState(false);

  async function updateuserdata() {
    // Validate input fields

    const validationErrors = {
      password: !password.trim(),
      newpassword: !newpassword.trim(),
    };
    setErrors(validationErrors);

    if (validationErrors.password || validationErrors.newpassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    const passwords = {
      oldpassword: password,
      newpass: newpassword,
    };

    if (auth?.user?._id) {
      setOpen(true);
      try {
        const response = await UpdatePassword(auth?.user?._id, passwords);

        if (response.success) {
          setOpen(false);
          toast.success(response.message);
          Setpassword("");
          Setnewpassword("");
        } else {
          setOpen(false);
          toast.error(response.message);
        }
      } catch (error) {
        setOpen(false);
        // console.log(error);
        toast.error("An error occurred while updating user info");
      }
    }
  }

  return (
    <div className="w-full mb-2">
      <Toaster />
      <div className="flex flex-col justify-center gap-4 border-2 border-gray-300 m-auto w-[85%] lg:w-3/4 xl:w-1/2 rounded-lg p-5">
        <p className="text-3xl text-center font-medium">Reset Password</p>
        <hr />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:w-1/2 m-auto">
            <label className="font-medium">Old Password</label>
            <Input
              name="name"
              value={password}
              onChange={(e) => {
                Setpassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: false }));
              }}
              size="md"
              error={errors.password}
              placeholder="Enter your old password"
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-1/2 m-auto">
            <label className="font-medium">New password</label>
            <Input
              name="mobile"
              value={newpassword}
              onChange={(e) => {
                Setnewpassword(e.target.value);
                setErrors((prev) => ({ ...prev, newpassword: false }));
              }}
              size="md"
              error={errors.newpassword}
              placeholder="Enter your new password"
            />
          </div>

          <div className="flex flex-col gap-2 w-1/4 m-auto mt-4">
            <Button onClick={updateuserdata}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 mb-2">
        <Link href="/" className="w-[100px]">
          <Button className="w-[100px]">Home</Button>
        </Link>
      </div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UserPassword;
