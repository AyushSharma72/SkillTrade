"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components that might access `document`
const TextField = dynamic(() => import("@mui/material/TextField"), {
  ssr: false,
});
const IconButton = dynamic(() => import("@mui/material/IconButton"), {
  ssr: false,
});
const InputAdornment = dynamic(() => import("@mui/material/InputAdornment"), {
  ssr: false,
});
const Visibility = dynamic(() => import("@mui/icons-material/Visibility"), {
  ssr: false,
});
const VisibilityOff = dynamic(
  () => import("@mui/icons-material/VisibilityOff"),
  { ssr: false }
);
const Backdrop = dynamic(() => import("@mui/material/Backdrop"), {
  ssr: false,
});
const CircularProgress = dynamic(
  () => import("@mui/material/CircularProgress"),
  { ssr: false }
);
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/UserAuthContent";
import "react-phone-input-2/lib/style.css";

const UserRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [auth, setauth] = useAuth();
  const [mobileNo, setMobileNo] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function RegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const Address = formData.get("Address");
    const Pincode = formData.get("Pincode");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/UserRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            MobileNo: mobileNo,
            Email,
            Password,
            Address,
            Pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
        setMobileNo("");
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please try again");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <form
        className="w-full flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-2 rounded-md"
        onSubmit={RegisterUser}
      >
        <p className="font-bold text-2xl">Create User Account</p>
        <TextField
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Name"
        />
        <div className="w-3/4">
          <label className="text-sm text-gray-600 mb-1 block">
            Mobile Number
          </label>
          <PhoneInput
            country={"in"}
            value={mobileNo}
            onChange={(value) => setMobileNo(value)}
            inputStyle={{
              width: "100%",
              height: "56px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              paddingLeft: "48px",
            }}
            buttonStyle={{
              border: "none",
              borderRadius: "4px 0 0 4px",
            }}
          />
        </div>
        <TextField
          label="Email"
          variant="outlined"
          className="w-3/4"
          required
          type="email"
          name="Email"
        />
        <TextField
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
          label="Full Address"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Address"
        />
        <TextField
          label="Area Pincode"
          variant="outlined"
          className="w-3/4"
          required
          type="number"
          name="Pincode"
        />
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default UserRegisterForm;
